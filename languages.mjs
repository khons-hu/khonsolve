export const languages=[
{id:'javascript',label:'JavaScript',ext:'js',runnable:true},
{id:'typescript',label:'TypeScript',ext:'ts',runnable:true},
{id:'python',label:'Python',ext:'py',runnable:true},
{id:'go',label:'Go',ext:'go',runnable:false,url:'https://go.dev/play/',runner:'Go Playground'},
{id:'cpp',label:'C++',ext:'cpp',runnable:false,url:'https://godbolt.org/',runner:'Compiler Explorer'},
{id:'c',label:'C',ext:'c',runnable:false,url:'https://godbolt.org/',runner:'Compiler Explorer'}];
export function starter(exercise,language){
 if(language==='javascript')return exercise.starter||'';
 const params={repeat:'ids',window:'readings, k',brackets:'text',merge:'intervals',zero:'discount = None'};
 if(language==='python')return `def solve(${params[exercise.id]||'value'}):\n    # Write your approach above, then try it here.\n    pass\n`;
 const signatures={repeat:'ids: number[]): number | null',window:'readings: number[], k: number): number | null',brackets:'text: string): boolean',merge:'intervals: number[][]): number[][]',zero:'discount?: number | null): number'};
 if(language==='typescript')return `function solve(${signatures[exercise.id]||'value: unknown): unknown'} {\n  // Return your result.\n  throw new Error("Not implemented yet");\n}\n`;
 const go={repeat:'ids []int) *int',window:'readings []int, k int) *int',brackets:'text string) bool',merge:'intervals [][2]int) [][2]int',zero:'discount *int) int'};
 if(language==='go')return `package main\n\nimport "fmt"\n\n// Use nil for an absent value. A pointer to 0 is not nil.\nfunc solve(${go[exercise.id]||'value int) int'} {\n    panic("Not implemented yet")\n}\n\nfunc main() {\n    fmt.Println("Add the exercise examples as calls to solve.")\n}\n`;
 const cpp={repeat:'std::optional<int> solve(const std::vector<int>& ids)',window:'std::optional<int> solve(const std::vector<int>& readings, int k)',brackets:'bool solve(const std::string& text)',merge:'std::vector<std::array<int, 2>> solve(const std::vector<std::array<int, 2>>& intervals)',zero:'int solve(std::optional<int> discount)'};
 if(language==='cpp')return `// C++17 or newer. Use std::nullopt for an absent result.\n#include <iostream>\n#include <vector>\n#include <array>\n#include <string>\n#include <optional>\n#include <stdexcept>\n\n${cpp[exercise.id]||'int solve(int value)'} {\n    throw std::logic_error("Not implemented yet");\n}\n\nint main() {\n    // Add the exercise examples as calls to solve.\n    return 0;\n}\n`;
 const c={repeat:'OptionalInt solve(const int *ids, size_t count)',window:'OptionalInt solve(const int *readings, size_t count, int k)',brackets:'bool solve(const char *text)',merge:'size_t solve(const Interval *intervals, size_t count, Interval *output)',zero:'int solve(OptionalInt discount)'};
 return `// C11 or newer. Add tests in main().\n#include <stdio.h>\n#include <stdbool.h>\n#include <stddef.h>\n#include <stdlib.h>\n\ntypedef struct { bool present; int value; } OptionalInt;\ntypedef struct { int start; int end; } Interval;\n// For intervals, output has capacity count; return the number written.\n${c[exercise.id]||'int solve(int value)'} {\n    // Implement the contract. Do not confuse absent with zero.\n    abort();\n}\n\nint main(void) {\n    // Add the exercise examples as calls to solve.\n    return 0;\n}\n`;
}
export function activeLanguage(a){return languages.find(l=>l.id===a.language)||languages[0];}
export function draft(a,e){const id=activeLanguage(a).id;return id==='javascript'?(a.code??starter(e,id)):(a.drafts?.[id]??starter(e,id));}
export function setDraft(a,value){const id=activeLanguage(a).id;if(id==='javascript')a.code=value;else{a.drafts??={};a.drafts[id]=value;}}
