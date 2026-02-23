"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import rehypeRaw from "rehype-raw";

function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}

export default function ExpeditionClient({ md }: { md: string }) {
    const [p, setP] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = Math.max(1, doc.scrollHeight - window.innerHeight);
            setP(clamp01(window.scrollY / max));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 四阶段（15 / 35 / 30 / 20）
    type Stage = "none" | "line" | "open" | "openWhite";
    const stage: Stage =
        p < 0.15 ? "none" : p < 0.5 ? "line" : p < 0.8 ? "open" : "openWhite";

    // line 出现的整体淡入：15% -> 20%
    const fadeIn = clamp01((p - 0.15) / 0.05);

    // 交叉淡入 1：line -> open（48% -> 52%）
    const blend1 = clamp01((p - 0.48) / (0.52 - 0.48));

    // 交叉淡入 2：open -> openWhite（78% -> 82%）
    const blend2 = clamp01((p - 0.78) / (0.82 - 0.78));

    // ✅ 从 90% 开始冲刺
    const sprintStart = 0.85;

    // 图片路径（按你的 public 文件名）
    const srcLine = "/crack-line.png";
    const srcOpen = "/crack-open-v2.png";
    const srcOpenWhite = "/crack-open-white-v2.png";

    // 冷灰微光（后面你想调淡就把 alpha 调小）
    const glow =
        "drop-shadow(0 0 14px rgba(220, 230, 240, 0.22)) drop-shadow(0 0 60px rgba(200, 210, 220, 0.10))";

    // 连续推进 + 冲刺
    const baseScale =
        stage === "none"
            ? 1.1
            : stage === "line"
                ? 1.1 + (p - 0.15) * 0.6 // 1.1 -> 1.31
                : stage === "open"
                    ? 1.31 + (p - 0.5) * 0.7 // 1.31 -> 1.52
                    : 1.52 + (Math.min(p, sprintStart) - 0.8) * 0.9; // 1.52 -> ~1.61 (到 0.90)

    // 90% 后冲刺：平方加速
    const sprint =
        p > sprintStart
            ? Math.pow((p - sprintStart) / (1 - sprintStart), 2) * 0.9
            : 0;

    const scale = baseScale + sprint;

    // 三层透明度（最稳：不会在前面“闪”）
    const lineOpacity =
        stage === "line"
            ? 1
            : stage === "open" || stage === "openWhite"
                ? Math.max(0, 1 - blend1)
                : 0;

    const openOpacity =
        stage === "line"
            ? blend1
            : stage === "open"
                ? 1
                : stage === "openWhite"
                    ? Math.max(0, 1 - blend2)
                    : 0;

    const openWhiteOpacity = stage === "openWhite" ? blend2 : 0;

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden text-soft-stroke">
            <NavBar />

            {/* 裂缝层：stage 为 none 时完全不渲染 */}
            {stage !== "none" && (
                <div
                    aria-hidden
                    className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
                >
                    <div
                        className="relative w-[420px] h-[900px]"
                        style={{
                            transform: `scale(${scale})`,
                            opacity: fadeIn,
                            transition: "transform 120ms linear, opacity 160ms ease-out",
                            filter: glow,
                        }}
                    >
                        {/* line */}
                        <div
                            className="absolute inset-0"
                            style={{
                                opacity: lineOpacity,
                                transition: "opacity 140ms linear",
                            }}
                        >
                            <Image
                                src={srcLine}
                                alt=""
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>

                        {/* open */}
                        <div
                            className="absolute inset-0"
                            style={{
                                opacity: openOpacity,
                                transition: "opacity 140ms linear",
                            }}
                        >
                            <Image src={srcOpen} alt="" fill className="object-contain" />
                        </div>

                        {/* openWhite */}
                        <div
                            className="absolute inset-0"
                            style={{
                                opacity: openWhiteOpacity,
                                transition: "opacity 140ms linear",
                            }}
                        >
                            <Image
                                src={srcOpenWhite}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 档案文本区 */}
            <div className="relative z-20 mx-auto p-10 max-w-3xl text-left">
                <div className="mb-6">
                    <div className="font-mono text-xs text-white/60">
                        ARCHIVE / EIDOLON-1691 / EXPEDITION
                    </div>
                    <h1 className="text-3xl font-mono mt-2">Expedition Log</h1>
                </div>

                <div
                    className="
            prose prose-invert max-w-none
            prose-p:leading-8 prose-p:text-white/82
            prose-headings:font-mono prose-headings:text-white
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-strong:text-white
            prose-hr:border-white/15 prose-hr:my-10
            prose-a:text-white prose-a:underline prose-a:underline-offset-4
            prose-li:text-white/80
            prose-blockquote:border-l-white/25 prose-blockquote:text-white/70
            prose-code:text-white prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-black prose-pre:border prose-pre:border-white/15
          "
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
                        components={{
                            h1: ({ children }) => (
                                <h2 className="font-mono text-2xl mt-10 mb-4">{children}</h2>
                            ),
                            h2: ({ children }) => (
                                <h3 className="font-mono text-xl mt-10 mb-3">{children}</h3>
                            ),
                            p: ({ children }) => (
                                <p className="leading-8 text-white/85">{children}</p>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l border-white/25 pl-4 my-6 text-white/75">
                                    {children}
                                </blockquote>
                            ),
                            hr: () => <hr className="border-white/15 my-10" />,

                            /* 🔹 档案卡片 */
                            aside: ({ children }) => (
                                <section className="relative my-10 rounded-2xl border border-white/14 bg-black/35 px-6 py-6
shadow-[0_10px_40px_rgba(0,0,0,0.45),_0_0_0_1px_rgba(255,255,255,0.05)]
">
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.18] mix-blend-overlay"
                                        style={{
                                            backgroundImage:
                                                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
                                            backgroundSize: "6px 6px",
                                        }}
                                    />
                                    <div className="relative flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-[18px] items-center rounded-md border border-white/14 bg-black/25 px-2
          font-mono text-[11px] tracking-[0.22em] text-white/70">
                                                FIELD LOG
                                            </span>
                                            <span className="font-mono text-[11px] tracking-[0.18em] text-white/45">
                                                EXPEDITION
                                            </span>
                                        </div>
                                        <div className="font-mono text-[11px] text-white/40">EID-1691</div>
                                    </div>
                                    <div className="relative text-white/82 leading-8 space-y-4">{children}</div>
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-black/25 to-transparent" />
                                </section>
                            ),
                        }}
                    >
                        {md}
                    </ReactMarkdown>
                </div>

                <div className="h-16" />
                <div className="font-mono text-xs text-white/50">
                    SCROLL: {(p * 100).toFixed(0)}% / STAGE: {stage.toUpperCase()}
                </div>
            </div>
        </div>
    );
}