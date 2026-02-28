# 🛡️ AI Shadow QA (Working Title)

> **"Observe, Analyze, and Record"** > 실시간 시각 분석을 통한 범용 QA 보고 자동화 솔루션  
> A vision-based universal QA agent and automated reporting system.

---

## 🌟 핵심 가치 (Core Value)

**"보고, 판단하고, 기록한다"**
- 사용자의 조작 과정을 실시간으로 지켜보고, 문제 발생 시 논리적으로 원인을 분석하며, 번거로운 리포팅 과정을 자동화합니다.

---

## ❓ 문제 인식 (Problem & Opportunity)

- **문서화 병목 현상 (Documentation Bottleneck):** QA 진행 중 에러 발견 시 캡처, 재현 경로 작성 등 부가 작업이 전체 프로세스의 약 30%를 점유합니다.
- **플랫폼 파편화 (Platform Fragmentation):** 웹/모바일뿐만 아니라 하드웨어(LED, 스위치 등) 환경까지 통합 관리할 수 있는 도구가 부재합니다.

---

## 🛠️ 주요 기능 (Key Features)

### 1️⃣ Multimodal Stream Watcher (Gemini Live API)
- **실시간 분석**: 화면 공유 또는 카메라 피드를 실시간으로 분석하여 조작 맥락(Context)을 데이터 시퀀스로 유지합니다.
- **시각 정보 기반**: 웹 브라우저를 넘어 실물 장비까지 분석 대상을 무한히 확장할 수 있습니다. (Unlimited Scalability)

### 2️⃣ Context-Aware Error Reasoning (Gemini 3.1 Pro)
- **논리적 추론**: 에러 발생 시점 이전의 프레임을 역추적하여 단순 UI 이슈인지 시스템 장애인지 논리적 원인을 진단합니다.
- **액션 플랜**: 에러 원인 분석과 함께 즉각적인 해결 방안(Action Plan)을 제시합니다.

---

## 🚀 유저 시나리오 (User Scenarios)

### 💻 Web Development
개발자가 결제 로직 테스트 중 버튼 무반응 에러 발견 → **[에러 분석]** 클릭 → AI가 영상 피드를 역추적하여 "UI Freeze 및 네트워크 타임아웃" 진단 → **노션/지라 티켓 자동 생성**.

### 🔌 Hardware & Embedded
엔지니어가 장비 스위치를 켰으나 LED 미점멸 → 카메라로 장비를 비추며 **[에러 분석]** 클릭 → AI가 "물리적 상태와 기대 동작의 불일치" 분석 → **리포트 생성**.

---

## 🌎 Global Summary

| Feature | Description |
| :--- | :--- |
| **Context-Aware** | Real-time analysis of screen shares/camera feeds to maintain operational context. |
| **No Reproduction** | Eliminates the need for manual reproduction by tracking interaction context via live feed. |
| **Unlimited Scope** | Vision-based analysis allows testing physical devices and IoT hardware beyond the browser. |

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
