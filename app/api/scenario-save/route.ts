import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPO = "positopy/this-politics-of-mine";
const OWNER = "positopy";
const FILE_PATH = "scenarios.yaml";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_BRANCH = "main";

async function createGithubPR(yaml: string, message: string) {
  const apiBase = "https://api.github.com";
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  // 1. Get latest commit SHA of base branch
  const branchRes = await fetch(
    `${apiBase}/repos/${REPO}/git/ref/heads/${BASE_BRANCH}`,
    { headers }
  );
  const branchData = await branchRes.json();
  const latestCommitSha = branchData.object.sha;

  // 2. Get tree SHA
  const commitRes = await fetch(
    `${apiBase}/repos/${REPO}/git/commits/${latestCommitSha}`,
    { headers }
  );
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create new branch
  const branchName = `scenario-edit-${Date.now()}`;
  await fetch(`${apiBase}/repos/${REPO}/git/refs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    }),
  });

  // 4. Create new blob (file content)
  const blobRes = await fetch(`${apiBase}/repos/${REPO}/git/blobs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      content: Buffer.from(yaml).toString("base64"),
      encoding: "base64",
    }),
  });
  const blobData = await blobRes.json();
  const blobSha = blobData.sha;

  // 5. Create new tree
  const treeRes = await fetch(`${apiBase}/repos/${REPO}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [
        {
          path: FILE_PATH,
          mode: "100644",
          type: "blob",
          sha: blobSha,
        },
      ],
    }),
  });
  const treeData = await treeRes.json();
  const newTreeSha = treeData.sha;

  // 6. Create commit
  const commitRes2 = await fetch(`${apiBase}/repos/${REPO}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      tree: newTreeSha,
      parents: [latestCommitSha],
    }),
  });
  const commitData2 = await commitRes2.json();
  const newCommitSha = commitData2.sha;

  // 7. Update branch ref
  await fetch(`${apiBase}/repos/${REPO}/git/refs/heads/${branchName}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      sha: newCommitSha,
    }),
  });

  // 8. Create PR
  const prRes = await fetch(`${apiBase}/repos/${REPO}/pulls`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: message,
      head: branchName,
      base: BASE_BRANCH,
      body: "시나리오 에디터에서 자동 생성된 PR입니다.",
    }),
  });
  const prData = await prRes.json();
  return prData;
}

export async function POST(req: NextRequest) {
  const { yaml, message } = await req.json();
  // 1. 파일로 저장 (로컬)
  const filePath = path.join(process.cwd(), FILE_PATH);
  fs.writeFileSync(filePath, yaml, "utf8");
  // 2. GitHub PR 생성
  const pr = await createGithubPR(yaml, message || "시나리오 변경");
  return NextResponse.json({ pr });
}
