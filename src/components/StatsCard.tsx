"use client";

import React from "react";
import styles from "./StatsCard.module.css";
import { TaskWithSubtasks } from "@/app/actions";

interface StatsCardProps {
  tasks: TaskWithSubtasks[];
}

export default function StatsCard({ tasks }: StatsCardProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.card}>
      <div className={styles.progressContainer}>
        <svg width="140" height="140" className={styles.svgRing}>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={styles.bgCircle}
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={styles.fgCircle}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className={styles.percentageText}>
          <span className={styles.percentValue}>{percentage}%</span>
          <span className={styles.percentLabel}>完了</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{total}</span>
          <span className={styles.statLabel}>タスク合計</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statVal} ${styles.activeGlow}`}>{active}</span>
          <span className={styles.statLabel}>進行中</span>
        </div>
      </div>
    </div>
  );
}
