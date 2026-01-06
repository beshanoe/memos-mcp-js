package memos

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestClientSearchMemos(t *testing.T) {
	creator := int64(9)
	pinned := true

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			t.Fatalf("unexpected method: %s", r.Method)
		}
		if r.URL.Path != "/api/v1/memos" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Bearer token" {
			t.Fatalf("missing auth header")
		}

		query := r.URL.Query()
		if query.Get("pageSize") != "5" {
			t.Fatalf("unexpected pageSize: %s", query.Get("pageSize"))
		}
		if query.Get("orderBy") != "display_time desc" {
			t.Fatalf("unexpected orderBy: %s", query.Get("orderBy"))
		}
		if query.Get("pageToken") != "offset=10" {
			t.Fatalf("unexpected pageToken: %s", query.Get("pageToken"))
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"memos":[{"name":"memos/9","uid":"9","content":"hello","visibility":"PUBLIC","pinned":true}],"nextPageToken":"next"}`))
	}))
	defer srv.Close()

	client, err := NewClient(srv.URL, "token", 5*time.Second)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	resp, err := client.SearchMemos(context.Background(), SearchRequest{
		Query:      "hello",
		CreatorID:  &creator,
		Tag:        "work",
		Visibility: "PUBLIC",
		Pinned:     &pinned,
		Limit:      5,
		Offset:     10,
		OrderBy:    "display_time desc",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.NextPageToken != "next" {
		t.Fatalf("unexpected nextPageToken: %s", resp.NextPageToken)
	}
	if len(resp.Memos) != 1 {
		t.Fatalf("unexpected memo count: %d", len(resp.Memos))
	}
	if resp.Memos[0].UID != "9" {
		t.Fatalf("unexpected memo uid: %s", resp.Memos[0].UID)
	}
}

func TestClientCreateMemo(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Fatalf("unexpected method: %s", r.Method)
		}
		if r.URL.Path != "/api/v1/memos" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}

		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Fatalf("decode payload: %v", err)
		}
		if payload["content"] != "test memo" {
			t.Fatalf("unexpected content: %v", payload["content"])
		}
		if payload["visibility"] != "PRIVATE" {
			t.Fatalf("unexpected visibility: %v", payload["visibility"])
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"name":"memos/1","uid":"1","content":"test memo","visibility":"PRIVATE","pinned":false}`))
	}))
	defer srv.Close()

	client, err := NewClient(srv.URL, "", 5*time.Second)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	memo, err := client.CreateMemo(context.Background(), CreateMemoRequest{Content: "test memo"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if memo.UID != "1" {
		t.Fatalf("unexpected memo uid: %s", memo.UID)
	}
}

func TestClientDeleteMemo(t *testing.T) {
	called := false
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
		if r.Method != http.MethodDelete {
			t.Fatalf("unexpected method: %s", r.Method)
		}
		if r.URL.Path != "/api/v1/memos/abc" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		if r.URL.Query().Get("force") != "true" {
			t.Fatalf("unexpected force param: %s", r.URL.Query().Get("force"))
		}
		w.WriteHeader(http.StatusOK)
	}))
	defer srv.Close()

	client, err := NewClient(srv.URL, "", 5*time.Second)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if err := client.DeleteMemo(context.Background(), "abc", true); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !called {
		t.Fatalf("expected handler to be called")
	}
}
