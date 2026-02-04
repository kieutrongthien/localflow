export const buildPlanningReadme = (projectPath: string) => `# LocalFlow Planning

**Project path:** ${projectPath}

## Hướng dẫn nhanh
- Lưu backlog trong thư mục \`.planning\`
- Sử dụng epics/stories/tasks để theo dõi tiến độ
- README này được tạo tự động, có thể chỉnh sửa trong app

---
Cập nhật lần đầu: ${new Date().toISOString()}
`
