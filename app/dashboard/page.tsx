"use client";

import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ArticleForm } from "@/components/article-form";
import { ArticleDetail } from "@/components/article-detail";

export default function DashboardPage() {
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
            <ArticleForm onArticleCreated={handleArticleCreated} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
