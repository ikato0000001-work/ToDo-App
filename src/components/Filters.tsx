"use client";

import React from "react";
import styles from "./Filters.module.css";

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: string[];
}

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  categories,
}: FiltersProps) {
  return (
    <div className={styles.container}>
      {/* Search */}
      <div className={styles.section}>
        <span className={styles.label}>検索</span>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="タスクを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div className={styles.section}>
        <span className={styles.label}>並び替え</span>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt_desc">作成日 (新しい順)</option>
          <option value="createdAt_asc">作成日 (古い順)</option>
          <option value="dueDate_asc">期限 (近い順)</option>
          <option value="dueDate_desc">期限 (遠い順)</option>
          <option value="priority_desc">優先度 (高い順)</option>
          <option value="priority_asc">優先度 (低い順)</option>
        </select>
      </div>

      {/* Priority Filters */}
      <div className={styles.section}>
        <span className={styles.label}>優先度フィルター</span>
        <div className={styles.priorityTabs}>
          {["All", "HIGH", "MEDIUM", "LOW"].map((p) => {
            const isActive = priority === p;
            const tabClass = isActive 
              ? styles[`activeTab_${p}`] 
              : "";
            return (
              <button
                key={p}
                className={`${styles.priorityTab} ${tabClass}`}
                onClick={() => setPriority(p)}
              >
                {p === "All" ? "すべて" : p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category List */}
      <div className={styles.section}>
        <span className={styles.label}>カテゴリー</span>
        <div className={styles.categoryList}>
          <button
            className={`${styles.categoryTag} ${
              category === "All" ? styles.activeCategory : ""
            }`}
            onClick={() => setCategory("All")}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTag} ${
                category === cat ? styles.activeCategory : ""
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
