"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/Sidebar";

interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  total_submissions: number;
  success_rate: number;
  tags?: string[];
  status?: "todo" | "solved" | "attempted";
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type SortOption = "id" | "acceptance" | "difficulty";

const MOCK_PROBLEMS: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "easy", total_submissions: 12500, success_rate: 65.4, tags: ["Array", "Hash Table"], status: "solved" },
  { id: 2, title: "Add Two Numbers", difficulty: "medium", total_submissions: 9800, success_rate: 42.1, tags: ["Linked List", "Math"], status: "attempted" },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "medium", total_submissions: 11200, success_rate: 35.8, tags: ["Hash Table", "String", "Sliding Window"] },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "hard", total_submissions: 4500, success_rate: 22.5, tags: ["Array", "Binary Search", "Divide and Conquer"] },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "medium", total_submissions: 8900, success_rate: 32.7, tags: ["String", "Dynamic Programming"] },
  { id: 7, title: "Reverse Integer", difficulty: "medium", total_submissions: 14000, success_rate: 28.1, tags: ["Math"], status: "solved" },
  { id: 10, title: "Regular Expression Matching", difficulty: "hard", total_submissions: 3200, success_rate: 28.4, tags: ["String", "Dynamic Programming", "Recursion"] },
  { id: 11, title: "Container With Most Water", difficulty: "medium", total_submissions: 8200, success_rate: 54.9, tags: ["Array", "Two Pointers", "Greedy"] },
  { id: 15, title: "3Sum", difficulty: "medium", total_submissions: 10500, success_rate: 33.3, tags: ["Array", "Two Pointers", "Sorting"] },
  { id: 20, title: "Valid Parentheses", difficulty: "easy", total_submissions: 18500, success_rate: 72.1, tags: ["String", "Stack"], status: "solved" },
  { id: 21, title: "Merge Two Sorted Lists", difficulty: "easy", total_submissions: 15200, success_rate: 64.8, tags: ["Linked List", "Recursion"] },
  { id: 23, title: "Merge k Sorted Lists", difficulty: "hard", total_submissions: 5100, success_rate: 51.4, tags: ["Linked List", "Divide and Conquer", "Heap"] },
  { id: 33, title: "Search in Rotated Sorted Array", difficulty: "medium", total_submissions: 7800, success_rate: 40.5, tags: ["Array", "Binary Search"] },
  { id: 42, title: "Trapping Rain Water", difficulty: "hard", total_submissions: 6800, success_rate: 61.2, tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"] },
  { id: 53, title: "Maximum Subarray", difficulty: "medium", total_submissions: 16000, success_rate: 50.8, tags: ["Array", "Divide and Conquer", "Dynamic Programming"] },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const diff = difficulty.toLowerCase();
  const styles = 
    diff === "easy" ? "border-secondary-container text-secondary-container bg-secondary-container/10" :
    diff === "medium" ? "border-primary-container text-primary-container bg-primary-container/10" :
    "border-error text-error bg-error/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      {difficulty}
    </span>
  );
}

export default function ProblemsPage() {
  const { API_URL } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("id");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems`);
      if (res.ok) {
        const data = await res.json();
        // Fallback to mock data if API returns empty array or we want tags
        setProblems(data.data?.length > 0 ? data.data : MOCK_PROBLEMS);
      } else {
        setProblems(MOCK_PROBLEMS);
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setProblems(MOCK_PROBLEMS);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = problems.filter((p) => {
      const matchDiff = filter === "all" || p.difficulty.toLowerCase() === filter;
      const matchSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search) ||
        p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchDiff && matchSearch;
    });

    result.sort((a, b) => {
      if (sort === "id") return a.id - b.id;
      if (sort === "acceptance") return b.success_rate - a.success_rate;
      if (sort === "difficulty") {
        const order = { easy: 1, medium: 2, hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

    return result;
  }, [problems, filter, search, sort]);

  const displayedProblems = filteredAndSorted.slice(0, page * itemsPerPage);
  const hasMore = displayedProblems.length < filteredAndSorted.length;

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-background">
          <span className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="font-terminal-sm text-on-surface-variant">Loading problem library...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        <style dangerouslySetInnerHTML={{ __html: `.problem-row:hover{background:var(--color-surface-container-high);border-color:var(--color-outline-variant);transform:translateX(4px);}` }} />
        
        {/* Header & Controls */}
        <div className="bg-surface-container-lowest border-b border-outline-variant px-margin-desktop py-6 shrink-0 z-10 relative">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary-fixed mb-1">Problem Library</h1>
              <p className="font-terminal-sm text-terminal-sm text-on-surface-variant">Master algorithms, data structures, and system design.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <div className="relative w-full md:w-80 group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary-container">search</span>
                  <input
                    type="text"
                    placeholder="Search problems or tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-code-block text-sm text-on-surface outline-none focus:border-primary-container transition-all"
                  />
                </div>
                <div className="flex bg-surface-container border border-outline-variant rounded-lg p-1">
                  {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setFilter(diff)}
                      className={`px-4 py-1 rounded text-xs font-bold uppercase transition-all ${filter === diff ? "bg-primary-container text-on-primary-container shadow" : "text-on-surface-variant hover:text-on-surface"}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto font-terminal-sm text-sm text-on-surface-variant">
                <span>Sort:</span>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface outline-none focus:border-primary-container transition-all"
                >
                  <option value="id">ID (Ascending)</option>
                  <option value="acceptance">Acceptance Rate</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="flex-1 overflow-y-auto px-margin-desktop py-8 relative">
          <div className="max-w-6xl mx-auto flex flex-col gap-3">
            {/* List Header */}
            <div className="grid grid-cols-[48px_1fr_120px_100px_80px] gap-4 px-6 py-2 font-terminal-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider sticky top-0 bg-background/90 backdrop-blur z-10 border-b border-outline-variant/30 mb-2">
              <div className="text-center">Status</div>
              <div>Problem</div>
              <div className="text-right">Acceptance</div>
              <div className="text-center">Difficulty</div>
              <div className="text-right">Freq</div>
            </div>

            {displayedProblems.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl opacity-50">search_off</span>
                <p className="font-terminal-sm">No problems found matching your criteria.</p>
                <button onClick={() => { setSearch(""); setFilter("all"); }} className="text-primary-container hover:underline text-sm font-bold">Clear Filters</button>
              </div>
            ) : (
              <>
                {displayedProblems.map((p, i) => {
                  const acc = p.total_submissions > 0 ? `${p.success_rate.toFixed(1)}%` : "—";
                  const freq = p.total_submissions > 0 ? Math.min(100, (p.success_rate * 0.8) + 20) : 0;
                  
                  return (
                    <Link
                      key={p.id}
                      href={`/problems/${p.id}`}
                      className="problem-row bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 grid grid-cols-[48px_1fr_120px_100px_80px] gap-4 items-center transition-all duration-300"
                      style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}
                    >
                      <div className="flex justify-center">
                        {p.status === "solved" ? (
                          <span className="material-symbols-outlined text-secondary-container text-xl" title="Solved">check_circle</span>
                        ) : p.status === "attempted" ? (
                          <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl" title="Attempted">pending</span>
                        ) : (
                          <span className="material-symbols-outlined text-outline-variant text-xl">radio_button_unchecked</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="font-body-md font-bold text-on-surface truncate group-hover:text-primary-fixed-dim transition-colors">
                          {p.id}. {p.title}
                        </span>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {p.tags.map(tag => (
                              <span key={tag} className="bg-surface-container px-2 py-0.5 rounded text-[10px] text-on-surface-variant whitespace-nowrap">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right font-code-block text-sm text-on-surface">{acc}</div>
                      
                      <div className="flex justify-center">
                        <DifficultyBadge difficulty={p.difficulty} />
                      </div>
                      
                      <div className="flex justify-end items-center">
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary-container rounded-full" style={{ width: `${freq}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {hasMore && (
                  <div className="pt-8 pb-12 flex justify-center">
                    <button 
                      onClick={() => setPage(p => p + 1)}
                      className="px-8 py-3 bg-surface-container border border-outline-variant rounded-lg font-bold text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant transition-all flex items-center gap-2"
                    >
                      Load More Problems <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
