async function pythonWorkerMain(){
 const send=self.postMessage.bind(self);
 self.onmessage=async event=>{
  const {code,tests,resources:r}=event.data;const urls=[],diagnostics=[];
  const blob=(value,type)=>{const url=URL.createObjectURL(new Blob([value],{type}));urls.push(url);return url;};
  try{
   const {loadPyodide}=new Function(r.loader+';return PyLoader;')();
   const {default:factory}=new Function(r.module+';return PyModule;')();
   const py=await loadPyodide({indexURL:'https://unused.invalid/',stdLibURL:blob(r.stdlib,'application/zip'),lockFileContents:r.lock,createPyodideModule:factory,wasmBinary:r.wasm,stdout:()=>{},stderr:line=>{if(diagnostics.length<8)diagnostics.push(String(line));}});
   py.globals.set('_code',code);py.globals.set('_tests',JSON.stringify(tests));send({type:'executing'});
   const result=py.runPython(`
import json, copy
_scope = {}
exec(_code, _scope)
_fn = _scope.get('solve')
if not callable(_fn):
    raise ValueError('Define a function named solve.')
_results = []
for _test in json.loads(_tests):
    _args = copy.deepcopy(_test['args'])
    _before = copy.deepcopy(_args)
    try:
        _value = _fn(*_args)
        _same = not _test.get('immutable', False) or _args == _before
        _results.append({'pass': _same and json.dumps(_value, sort_keys=True) == json.dumps(_test['expected'], sort_keys=True), 'actual': json.dumps(_value)[:500], 'expected': json.dumps(_test['expected']), 'note': '' if _same else 'Input was changed.'})
    except Exception as _error:
        _results.append({'pass': False, 'actual': str(_error)[:300], 'expected': json.dumps(_test['expected']), 'note': 'Threw an error'})
json.dumps(_results)
`);
   send({type:'result',results:JSON.parse(result)});
  }catch(error){send({type:'error',message:(String(error?.message||error)+' '+diagnostics.join(' ')).slice(-1600)});}
  finally{urls.forEach(url=>URL.revokeObjectURL(url));}
 };
}
