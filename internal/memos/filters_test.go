package memos

import "testing"

func TestBuildMemoFilter(t *testing.T) {
	creator := int64(7)
	pinned := true
	filter, err := BuildMemoFilter(SearchRequest{
		Query:      "hello \"world\"",
		CreatorID:  &creator,
		Tag:        "tag\"one",
		Visibility: "public",
		Pinned:     &pinned,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := "creator_id == 7 && content.contains(\"hello \\\"world\\\"\") && tag in [\"tag\\\"one\"] && visibility == \"PUBLIC\" && pinned == true"
	if filter != expected {
		t.Fatalf("unexpected filter: %s", filter)
	}
}

func TestNormalizeVisibility(t *testing.T) {
	value, err := normalizeVisibility("private")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if value != "PRIVATE" {
		t.Fatalf("unexpected value: %s", value)
	}
}
