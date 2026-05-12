"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 画像パス — spaces are %20 encoded for URL compatibility
// ============================================================
const IMG: Record<string, string> = {
  bg_flooded:  "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_03_49.png",
  bg_henle:    "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_04_04.png",
  bg_duct:     "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_36_35.png",
  bg_restored: "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_37_33.png",
  bg_proximal: "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_38_54.png",
  furo_n:      "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_04_14.png",
  furo_b1:     "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_04_42%20(1).png",
  furo_b2:     "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_04_42%20(2).png",
  spiro_n:     "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_28_31.png",
  spiro_t:     "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_28_39.png",
  nkcc2:       "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_28_48.png",
  aceta:       "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_28_54.png",
  vaso_n:      "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_29_06.png",
  vaso_a:      "/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8813%E6%97%A5%2001_30_05.png",
};

const BG_CSS: Record<string, string> = {
  bg_flooded:  "radial-gradient(ellipse at 30% 40%, #0a1a3a 0%, #061228 40%, #020810 100%)",
  bg_henle:    "radial-gradient(ellipse at 60% 50%, #3a0a00 0%, #1a0400 50%, #0a0000 100%)",
  bg_duct:     "radial-gradient(ellipse at 50% 50%, #1a0a3a 0%, #0d0520 60%, #060010 100%)",
  bg_restored: "radial-gradient(ellipse at 40% 30%, #0a1a3a 0%, #0d1e40 50%, #050e20 100%)",
  bg_proximal: "radial-gradient(ellipse at 50% 40%, #1a1000 0%, #100a00 50%, #080600 100%)",
};

const NAME_COLOR: Record<string, string> = {
  "フロセミド":       "#5bc8f5",
  "スピロノラクトン": "#c084fc",
  "NKCC2":           "#34d399",
  "アセタゾラミド":   "#fbbf24",
  "バソプレシン":     "#93c5fd",
};

// ============================================================
// Types
// ============================================================
interface Option {
  text: string;
  correct: boolean;
}

interface WrongFeedback {
  character: string;
  name: string;
  lines: string[];
}

interface TitleScene {
  type: "title";
  chapter: string;
  title: string;
  subtitle: string;
}

interface NarrationScene {
  type: "narration";
  bg: string;
  text: string;
}

interface DialogScene {
  type: "scene";
  bg: string;
  character: string;
  name: string;
  text: string;
}

interface ChoiceScene {
  type: "choice";
  bg: string;
  character: string;
  question: string;
  options: Option[];
  wrongFeedbacks: WrongFeedback[];
}

interface EndingScene {
  type: "ending";
  chapter: string;
  title: string;
  subtitle: string;
}

type Scene = TitleScene | NarrationScene | DialogScene | ChoiceScene | EndingScene;

// ============================================================
// シナリオ
// ============================================================
const SCENARIO: Scene[] = [
  { type:"title", chapter:"薬理学章", title:"浄化迷宮ネフロニア", subtitle:"第一幕「塩と水が溺れさせる都市」" },

  { type:"narration", bg:"bg_flooded", text:"腎臓領域「ネフロニア」。\n\n直径わずか数ミリのネフロンが百万本連なる、巨大な浄化の迷宮都市。" },
  { type:"narration", bg:"bg_flooded", text:"全身から届く血液を濾し、必要なものを取り戻し、不要なものを尿として送り出す——\nその均衡が、今、崩れていた。" },
  { type:"narration", bg:"bg_flooded", text:"街の至る所に水が溢れている。\n塩の結晶が路地に積み上がり、住民たちの足元が白く染まっていた。" },

  { type:"scene", bg:"bg_proximal", character:"aceta", name:"アセタゾラミド", text:"……ようやく来たか、マスター。\n私はアセタゾラミド。この地の歴史を知る者だ。" },
  { type:"scene", bg:"bg_proximal", character:"aceta", name:"アセタゾラミド", text:"かつてネフロニアの異変は、私の力で抑えられた。\nだが今の異変は、私の領域——近位尿細管——よりも深い場所が原因だ。" },
  { type:"scene", bg:"bg_proximal", character:"aceta", name:"アセタゾラミド", text:"ヘンレループの深部。\nそしておそらく、集合管にも問題がある。\n……呼べ。この時代に相応しい者たちを。" },

  { type:"scene", bg:"bg_flooded", character:"furo_n", name:"フロセミド", text:"……来たか、マスター。\n見ての通りだ。ネフロニアの浄化機構が詰まっている。" },
  { type:"scene", bg:"bg_flooded", character:"furo_n", name:"フロセミド", text:"原因はヘンレループの深部だ。\nNKCC2が再吸収しすぎている——Naが体に帰りすぎて、水が出て行けない。" },
  { type:"scene", bg:"bg_flooded", character:"furo_b1", name:"フロセミド", text:"私はループへ行く。\n——マスター、ここで力を貸せ。" },

  {
    type:"choice", bg:"bg_flooded", character:"furo_b1",
    question:"フロセミドが向かった「ヘンレループ太い上行脚」の主な輸送体はどれか？",
    options:[
      { text:"NKCC2（Na⁺/K⁺/2Cl⁻共輸送体）", correct:true },
      { text:"NCC（Na⁺/Cl⁻共輸送体）", correct:false },
      { text:"ENaC（上皮性Naチャネル）", correct:false },
    ],
    wrongFeedbacks:[
      { character:"furo_n", name:"フロセミド", lines:[
        "……違う。それは遠位尿細管の仕事だ。\n私のいる場所ではない。",
        "ヘンレループの太い上行脚と遠位尿細管を、\n混同している。もう一度考えろ。",
      ]},
      { character:"furo_n", name:"フロセミド", lines:[
        "それは集合管の番だ。私ではない。",
        "Na単独チャネルと、Na-K-Cl三者共輸送体——\n構造が根本から違う。場所を確かめろ。",
      ]},
    ],
  },

  { type:"scene", bg:"bg_henle", character:"nkcc2", name:"NKCC2", text:"……来たか。\n三つを束ねて運ぶ。それだけが私の形だ。" },
  { type:"scene", bg:"bg_henle", character:"nkcc2", name:"NKCC2", text:"Na。K。そして2つのCl。\n止まらない。———止められるまでは。" },
  { type:"scene", bg:"bg_henle", character:"furo_b2", name:"フロセミド", text:"そうだ——NKCC2。\nNa、K、Clを一度に三つ運ぶ輸送体だ。\n私の力がここに届く。三つの流れを、今断つ。" },
  { type:"narration", bg:"bg_henle", text:"フロセミドの宝具が解放される。\n\nNKCC2が封じられ、ヘンレループに滞留していた塩と水が一気に流れ出した。" },
  { type:"scene", bg:"bg_henle", character:"nkcc2", name:"NKCC2", text:"……封じられたか。\nそれならば、あとはお前たちの仕事だ。" },

  {
    type:"choice", bg:"bg_henle", character:"furo_b1",
    question:"フロセミドがNKCC2を封じた結果、最も起きやすい副作用はどれか？",
    options:[
      { text:"高カリウム血症", correct:false },
      { text:"代謝性アシドーシス", correct:false },
      { text:"低カリウム血症", correct:true },
    ],
    wrongFeedbacks:[
      { character:"furo_n", name:"フロセミド", lines:[
        "……高K？逆だ。私がNKCC2を封じると、\nKも一緒に流れ出る。",
        "高Kを起こすのはスピロノラクトンの領分だ。\n作用機序から、もう一度考え直せ。",
      ]},
      { character:"furo_n", name:"フロセミド", lines:[
        "アシドーシスはアセタゾラミドの宿命だ。私ではない。",
        "私が流すのはNa・K・Cl——\nHCO3排泄を主とするのは炭酸脱水酵素阻害薬の仕事だ。",
      ]},
    ],
  },

  { type:"scene", bg:"bg_duct", character:"spiro_n", name:"スピロノラクトン", text:"……少し待て、フロセミド。\n集合管でも異変がある。アルドステロン様の信号が強すぎてNaが戻り続けている。" },
  { type:"scene", bg:"bg_duct", character:"spiro_t", name:"スピロノラクトン", text:"Kが危ない。\n……あなたが流したものを、私が守る。" },
  { type:"scene", bg:"bg_duct", character:"furo_n", name:"フロセミド", text:"わかっている。だから今はお前に集合管を任せる。\n……スピロノラクトン、頼む。" },

  {
    type:"choice", bg:"bg_duct", character:"spiro_t",
    question:"スピロノラクトンはどこから作用するか？",
    options:[
      { text:"尿細管腔側（管腔面）から直接作用する", correct:false },
      { text:"血液側のMR（ミネラルコルチコイド受容体）に結合する", correct:true },
      { text:"糸球体濾過を直接増加させる", correct:false },
    ],
    wrongFeedbacks:[
      { character:"spiro_n", name:"スピロノラクトン", lines:[
        "……力ずくで管腔に踏み込む？\nそれは私の流儀ではない。",
        "フロセミドやチアジドとは、入り口が違う。\n私は受容体に成り代わる。もう一度考えてみなさい。",
      ]},
      { character:"spiro_n", name:"スピロノラクトン", lines:[
        "糸球体は、私の管轄外だ。",
        "私が向かうのは集合管の奥——\nそこで待つ受容体の座を、静かに奪う。",
      ]},
    ],
  },

  { type:"scene", bg:"bg_duct", character:"spiro_n", name:"スピロノラクトン", text:"……受容体の座を奪う。それだけで済む話だ。\n騒がしく戦う必要はない。" },
  { type:"narration", bg:"bg_duct", text:"スピロノラクトンがMRに静かに忍び込む。\nアルドステロンと同じ形を持ちながら、逆の意志で座を塞ぐ。\n\nNaの再吸収が止まり、Kが守られた。" },

  { type:"narration", bg:"bg_duct", text:"その時——集合管の奥から、\n冷たく静かな気配が近づいてきた。" },
  { type:"scene", bg:"bg_duct", character:"vaso_n", name:"バソプレシン", text:"……水を保つか、解き放つか。\nそれを決めるのは私だ。あなたではない。" },
  { type:"scene", bg:"bg_duct", character:"vaso_n", name:"バソプレシン", text:"集合管の最終判断は、私が下す。\nアクアポリンを開くか、閉じるか——\n均衡こそが、私の仕事。" },
  { type:"scene", bg:"bg_duct", character:"vaso_a", name:"バソプレシン", text:"……もし私が狂えば。\n水は止まらなくなる。全てを溺れさせながら。\nそれがSIADHの姿だ。忘れるな、マスター。" },

  { type:"scene", bg:"bg_restored", character:"furo_n", name:"フロセミド", text:"……Kが一緒に流れた。それは仕方のないことだ。\nだが——スピロノラクトンが守ってくれた。" },
  { type:"scene", bg:"bg_restored", character:"spiro_t", name:"スピロノラクトン", text:"あなたが失ったものを、私が取り戻した。\n……それだけのことだ。" },
  { type:"narration", bg:"bg_restored", text:"ネフロニアの水位が、ゆっくりと下がっていく。\n\n滞留していた塩が流れ出し、街に光が戻り始めた。\n浄化の迷宮が、再び動き出す。" },
  { type:"ending", chapter:"薬理学章　第一幕", title:"「浄化迷宮ネフロニア」", subtitle:"修復完了" },
];

// ============================================================
// TYPEWRITER
// ============================================================
function useTypewriter(text: string, speed = 35, active = true) {
  const [disp, setDisp] = useState("");
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisp(""); setDone(false);
    if (!active || !text) { setDone(true); return; }
    let i = 0;
    t.current = setInterval(() => {
      i++;
      setDisp(text.slice(0, i));
      if (i >= text.length) { clearInterval(t.current!); setDone(true); }
    }, speed);
    return () => clearInterval(t.current!);
  }, [text, active, speed]);

  const skip = useCallback(() => {
    clearInterval(t.current!);
    setDisp(text);
    setDone(true);
  }, [text]);

  return { disp, done, skip };
}

// ============================================================
// BACKGROUND
// ============================================================
function BG({ id }: { id?: string }) {
  const src = id ? IMG[id] : null;
  const css = (id && BG_CSS[id]) || "#0a0c14";
  return (
    <div style={{ position:"absolute", inset:0, background:css }}>
      {src && (
        <img
          src={src} alt=""
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
        />
      )}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6) 100%)",
        pointerEvents:"none",
      }} />
    </div>
  );
}

// ============================================================
// CHARACTER
// ============================================================
function Chara({ id }: { id?: string }) {
  const src = id ? IMG[id] : null;
  if (!src) return null;
  return (
    <div key={id} style={{
      position:"absolute", bottom:"22%", left:"50%",
      transform:"translateX(-45%)", height:"72%",
      display:"flex", alignItems:"flex-end",
      pointerEvents:"none", zIndex:2,
      animation:"fadeIn 0.3s ease",
    }}>
      <img
        src={src} alt=""
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        style={{
          height:"100%", objectFit:"contain", objectPosition:"bottom",
          filter:"drop-shadow(0 8px 32px rgba(0,0,0,0.95))",
        }}
      />
    </div>
  );
}

// ============================================================
// DIALOGUE BOX
// ============================================================
interface DBoxProps {
  name?: string;
  text: string;
  done: boolean;
  onAdv: () => void;
  onSkip: () => void;
}

function DBox({ name, text, done, onAdv, onSkip }: DBoxProps) {
  const col = (name && NAME_COLOR[name]) || "#fff";
  return (
    <div
      onClick={done ? onAdv : onSkip}
      style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:10, cursor:"pointer", userSelect:"none" }}
    >
      {name && (
        <div style={{
          marginLeft:24, marginBottom:-1, display:"inline-block",
          background:"rgba(8,12,28,0.96)", border:`1px solid ${col}`,
          borderBottom:"none", borderRadius:"4px 4px 0 0", padding:"4px 20px 6px",
        }}>
          <span style={{ color:col, fontSize:15, fontFamily:"serif", fontWeight:700, letterSpacing:2 }}>{name}</span>
        </div>
      )}
      <div style={{
        background:"linear-gradient(180deg,rgba(5,10,25,0.93) 0%,rgba(3,7,18,0.97) 100%)",
        border:`1px solid ${name ? col+"33" : "rgba(91,200,245,0.2)"}`,
        borderTop: name ? `1px solid ${col}44` : undefined,
        borderRadius: name ? "0 4px 0 0" : "4px 4px 0 0",
        padding:"18px 28px 28px", minHeight:110, position:"relative",
      }}>
        <p style={{
          color:"#e8e4d8", fontSize:16, lineHeight:1.9, margin:0,
          fontFamily:"serif", whiteSpace:"pre-line", letterSpacing:0.5,
          textShadow:"0 1px 3px rgba(0,0,0,0.9)",
        }}>{text}</p>
        {done && (
          <div style={{
            position:"absolute", bottom:14, right:20,
            width:9, height:9,
            borderRight:"2px solid rgba(91,200,245,0.8)",
            borderBottom:"2px solid rgba(91,200,245,0.8)",
            transform:"rotate(45deg)",
            animation:"bounce 0.7s ease-in-out infinite alternate",
          }} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// CHOICE
// ============================================================
interface ChoiceProps {
  scene: ChoiceScene;
  onCorrect: () => void;
}

function Choice({ scene, onCorrect }: ChoiceProps) {
  const [sel, setSel] = useState<number | null>(null);
  const [fbL, setFbL] = useState(0);
  const [showFb, setShowFb] = useState(false);
  const fb = showFb && sel !== null ? scene.wrongFeedbacks[sel] : null;
  const { disp, done, skip } = useTypewriter(fb ? fb.lines[fbL] : "", 30, !!fb);

  function pick(i: number) {
    if (scene.options[i].correct) { setTimeout(onCorrect, 200); return; }
    setSel(i); setFbL(0); setShowFb(true);
  }

  function adv() {
    if (!done) { skip(); return; }
    if (fb && fbL < fb.lines.length - 1) { setFbL(f => f + 1); }
    else { setShowFb(false); setSel(null); }
  }

  return (
    <div style={{ position:"absolute", inset:0, zIndex:10 }}>
      {showFb && fb ? (
        <DBox name={fb.name} text={disp} done={done} onAdv={adv} onSkip={skip} />
      ) : (
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:"linear-gradient(180deg,rgba(5,10,25,0.93),rgba(3,7,18,0.97))",
          border:"1px solid rgba(91,200,245,0.2)",
          borderRadius:"4px 4px 0 0", padding:"16px 20px 28px", zIndex:10,
        }}>
          <p style={{ color:"#c9a84c", fontSize:14, fontFamily:"serif", lineHeight:1.8, margin:"0 0 14px" }}>
            {scene.question}
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {scene.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                style={{
                  background:"linear-gradient(135deg,rgba(20,30,60,0.8),rgba(10,15,35,0.9))",
                  border:"1px solid rgba(91,200,245,0.25)", borderRadius:3,
                  color:"#e8e4d8", fontSize:14, fontFamily:"serif",
                  padding:"10px 16px", textAlign:"left", cursor:"pointer",
                  transition:"all 0.15s", letterSpacing:0.3,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,200,245,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,200,245,0.6)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,rgba(20,30,60,0.8),rgba(10,15,35,0.9))";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,200,245,0.25)";
                }}
              >
                {["A．","B．","C．"][i]}{opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TITLE / ENDING
// ============================================================
function Title({ scene, onNext }: { scene: TitleScene; onNext: () => void }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 100); }, []);
  return (
    <div
      onClick={onNext}
      style={{
        position:"absolute", inset:0, background:"#000",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        cursor:"pointer", zIndex:20, opacity:v ? 1 : 0, transition:"opacity 1s",
      }}
    >
      <div style={{ textAlign:"center", transform:v ? "translateY(0)" : "translateY(20px)", transition:"transform 1.2s" }}>
        <div style={{ color:"rgba(201,168,76,0.7)", fontSize:12, letterSpacing:6, marginBottom:16, fontFamily:"serif" }}>{scene.chapter}</div>
        <div style={{
          color:"#fff", fontSize:26, fontFamily:"serif", fontWeight:900, letterSpacing:4, marginBottom:12,
          textShadow:"0 0 40px rgba(91,200,245,0.5)",
        }}>{scene.title}</div>
        <div style={{ color:"rgba(200,200,210,0.6)", fontSize:13, letterSpacing:2, fontFamily:"serif" }}>{scene.subtitle}</div>
        <div style={{
          marginTop:48, color:"rgba(91,200,245,0.5)", fontSize:11, letterSpacing:5,
          animation:"pulse 1.5s ease-in-out infinite",
        }}>TAP TO START</div>
      </div>
    </div>
  );
}

function Ending({ scene, onRestart }: { scene: EndingScene; onRestart: () => void }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 400); }, []);
  return (
    <div style={{
      position:"absolute", inset:0,
      background:"linear-gradient(180deg,#000 0%,#050810 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:20, opacity:v ? 1 : 0, transition:"opacity 1.5s",
    }}>
      <div style={{ textAlign:"center", transform:v ? "translateY(0)" : "translateY(30px)", transition:"transform 1.5s" }}>
        <div style={{ width:50, height:1, background:"rgba(201,168,76,0.5)", margin:"0 auto 20px" }} />
        <div style={{ color:"rgba(201,168,76,0.8)", fontSize:12, letterSpacing:5, marginBottom:10, fontFamily:"serif" }}>{scene.chapter}</div>
        <div style={{ color:"#fff", fontSize:20, fontFamily:"serif", fontWeight:900, letterSpacing:3, marginBottom:8 }}>{scene.title}</div>
        <div style={{ color:"rgba(91,200,245,0.7)", fontSize:13, letterSpacing:4, fontFamily:"serif", marginBottom:40 }}>{scene.subtitle}</div>
        <div style={{ width:50, height:1, background:"rgba(201,168,76,0.5)", margin:"0 auto 40px" }} />
        <button
          onClick={onRestart}
          style={{
            background:"transparent", border:"1px solid rgba(91,200,245,0.35)", borderRadius:2,
            color:"rgba(91,200,245,0.7)", fontSize:11, letterSpacing:5,
            padding:"10px 32px", cursor:"pointer", fontFamily:"serif",
          }}
        >RESTART</button>
      </div>
    </div>
  );
}

// ============================================================
// MENU
// ============================================================
function Menu({ onClose, onRestart }: { onClose: () => void; onRestart: () => void }) {
  const items: [string, () => void][] = [["続きを読む", onClose], ["最初から", onRestart]];
  return (
    <div style={{
      position:"absolute", inset:0, background:"rgba(0,0,0,0.88)",
      zIndex:30, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:14,
    }}>
      {items.map(([l, a]) => (
        <button
          key={l}
          onClick={a}
          style={{
            background:"transparent", border:"1px solid rgba(91,200,245,0.3)", borderRadius:2,
            color:"#e8e4d8", fontSize:13, letterSpacing:4, padding:"12px 48px",
            cursor:"pointer", fontFamily:"serif", width:220,
          }}
        >{l}</button>
      ))}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function App() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [menu, setMenu] = useState(false);
  const sc = SCENARIO[idx];
  const isText = sc?.type === "narration" || sc?.type === "scene";
  const textContent = isText ? (sc as NarrationScene | DialogScene).text : "";
  const { disp, done, skip } = useTypewriter(textContent, 35, isText);

  const next = useCallback(() => {
    if (idx >= SCENARIO.length - 1) return;
    const nx = SCENARIO[idx + 1];
    const curBg = (sc as NarrationScene | DialogScene | ChoiceScene).bg;
    const nxBg = (nx as NarrationScene | DialogScene | ChoiceScene).bg;
    if (nxBg && nxBg !== curBg) {
      setFading(true);
      setTimeout(() => { setIdx(i => i + 1); setFading(false); }, 350);
    } else {
      setIdx(i => i + 1);
    }
  }, [idx, sc]);

  const restart = () => { setIdx(0); setMenu(false); };

  const pct = Math.round((idx / (SCENARIO.length - 1)) * 100);

  return (
    <div style={{
      width:"100%", height:"100vh", background:"#000",
      display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"serif",
    }}>
      <div style={{
        position:"relative",
        width:"min(100vw, calc(100vh * 9 / 16))",
        height:"min(100vh, calc(100vw * 16 / 9))",
        overflow:"hidden", background:"#000",
      }}>
        {/* 進捗バー */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"rgba(255,255,255,0.07)", zIndex:20 }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"rgba(91,200,245,0.5)", transition:"width 0.4s" }} />
        </div>

        {/* 背景 */}
        <div style={{ opacity:fading ? 0 : 1, transition:"opacity 0.35s", position:"absolute", inset:0 }}>
          <BG id={(sc as NarrationScene | DialogScene | ChoiceScene).bg} />
        </div>

        {/* 立ち絵 */}
        {(sc?.type === "scene" || sc?.type === "choice") && (
          <Chara id={(sc as DialogScene | ChoiceScene).character} key={(sc as DialogScene | ChoiceScene).character} />
        )}

        {sc?.type === "title"     && <Title   scene={sc as TitleScene}   onNext={next} />}
        {sc?.type === "ending"    && <Ending  scene={sc as EndingScene}  onRestart={restart} />}
        {sc?.type === "narration" && <DBox text={disp} done={done} onAdv={next} onSkip={skip} />}
        {sc?.type === "scene"     && <DBox name={(sc as DialogScene).name} text={disp} done={done} onAdv={next} onSkip={skip} />}
        {sc?.type === "choice"    && <Choice scene={sc as ChoiceScene} onCorrect={next} />}

        {sc?.type !== "title" && sc?.type !== "ending" && (
          <button
            onClick={() => setMenu(true)}
            style={{
              position:"absolute", top:14, right:14,
              background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:3, color:"rgba(255,255,255,0.6)", fontSize:10,
              letterSpacing:2, padding:"5px 10px", cursor:"pointer", zIndex:15, fontFamily:"serif",
            }}
          >MENU</button>
        )}

        {menu && <Menu onClose={() => setMenu(false)} onRestart={restart} />}
      </div>
    </div>
  );
}
