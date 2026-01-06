package memos

import (
	"fmt"
	"strings"
)

func BuildMemoFilter(req SearchRequest) (string, error) {
	filters := make([]string, 0, 5)
	if req.CreatorID != nil {
		filters = append(filters, fmt.Sprintf("creator_id == %d", *req.CreatorID))
	}
	if req.Query != "" {
		filters = append(filters, fmt.Sprintf("content.contains(\"%s\")", escapeFilterValue(req.Query)))
	}
	if req.Tag != "" {
		filters = append(filters, fmt.Sprintf("tag in [\"%s\"]", escapeFilterValue(req.Tag)))
	}
	if req.Visibility != "" {
		visibility, err := normalizeVisibility(req.Visibility)
		if err != nil {
			return "", err
		}
		filters = append(filters, fmt.Sprintf("visibility == \"%s\"", visibility))
	}
	if req.Pinned != nil {
		filters = append(filters, fmt.Sprintf("pinned == %t", *req.Pinned))
	}

	return strings.Join(filters, " && "), nil
}

func escapeFilterValue(value string) string {
	escaped := strings.ReplaceAll(value, "\\", "\\\\")
	escaped = strings.ReplaceAll(escaped, "\"", "\\\"")
	return escaped
}

func normalizeVisibility(value string) (string, error) {
	clean := strings.TrimSpace(strings.ToUpper(value))
	if clean == "" {
		return "", fmt.Errorf("visibility cannot be empty")
	}

	switch clean {
	case "PUBLIC", "PROTECTED", "PRIVATE":
		return clean, nil
	case "VISIBILITY_UNSPECIFIED", "UNSPECIFIED":
		return "VISIBILITY_UNSPECIFIED", nil
	default:
		return "", fmt.Errorf("invalid visibility: %s", value)
	}
}
