"use client";

import { ArticleDetail } from "@/components/article/ArticleDetail";
import { ArticleForm } from "@/components/article/ArticleForm";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useCallback } from "react";

export function DashboardPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [newArticleId, setNewArticleId] = useState<string | null>(null);

  const activeId = selectedArticleId ?? newArticleId;

  const handleArticleCreated = useCallback((id: string) => {
    setNewArticleId(id);
    setSelectedArticleId(null);
    window.dispatchEvent(new Event("articles:refresh"));
  }, []);

  const handleSelectArticle = useCallback((id: string) => {
    setSelectedArticleId(id);
    setNewArticleId(null);
  }, []);

  return (
    <DashboardLayout
      onSelectArticle={handleSelectArticle}
      selectedArticleId={activeId ?? undefined}
    >
      <div className="flex items-start justify-center min-h-full p-8">
        <div className="w-full max-w-2xl">
          {activeId ? (
            <ArticleDetail
              articleId={activeId}
              onBack={() => {
                setSelectedArticleId(null);
                setNewArticleId(null);
              }}
            />
          ) : (
            <ArticleForm onCreated={handleArticleCreated} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
