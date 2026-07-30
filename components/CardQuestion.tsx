"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Question, Card } from "@/lib/modules";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  value: string[];
  onChange: (v: string[]) => void;
  onDrillDown?: (card: Card) => void;
  disabled?: boolean;
}

const COLOR_MAP: Record<string, { border: string; bg: string; dot: string; text: string }> = {
  emerald: { border: "border-emerald-400", bg: "bg-emerald-50", dot: "bg-emerald-400", text: "text-emerald-700" },
  blue:    { border: "border-blue-400",    bg: "bg-blue-50",    dot: "bg-blue-400",    text: "text-blue-700"    },
  amber:   { border: "border-amber-400",   bg: "bg-amber-50",   dot: "bg-amber-400",   text: "text-amber-700"   },
  red:     { border: "border-red-400",     bg: "bg-red-50",     dot: "bg-red-400",     text: "text-red-700"     },
  purple:  { border: "border-purple-400",  bg: "bg-purple-50",  dot: "bg-purple-400",  text: "text-purple-700"  },
  rose:    { border: "border-rose-400",    bg: "bg-rose-50",    dot: "bg-rose-400",    text: "text-rose-700"    },
  indigo:  { border: "border-indigo-400",  bg: "bg-indigo-50",  dot: "bg-indigo-400",  text: "text-indigo-700"  },
};

function getColor(color?: string) {
  return COLOR_MAP[color ?? "indigo"] ?? COLOR_MAP.indigo;
}

export default function CardQuestion({ question, value, onChange, onDrillDown, disabled }: Props) {
  const [chars, setChars] = useState(0);

  const toggle = (cardId: string, card: Card) => {
    if (disabled) return;
    if (question.type === "CARD_SINGLE" || question.type === "EMOJI_MOOD") {
      onChange([cardId]);
      if (card.drillDown) onDrillDown?.(card);
    } else {
      const next = value.includes(cardId)
        ? value.filter((v) => v !== cardId)
        : [...value, cardId];
      onChange(next);
    }
  };

  const isSelected = (id: string) => value.includes(id);

  if (question.type === "EMOJI_MOOD") {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {question.cards.map((card) => (
          <button
            key={card.id}
            onClick={() => toggle(card.id, card)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 w-24 transition-all duration-200 focus:outline-none",
              isSelected(card.id)
                ? "border-indigo-500 bg-indigo-50 scale-110 shadow-lg shadow-indigo-100"
                : "border-gray-100 bg-white hover:border-indigo-200 hover:scale-105 hover:shadow-md"
            )}
          >
            <span className="text-4xl leading-none">{card.emoji}</span>
            <span className={cn("text-xs font-medium", isSelected(card.id) ? "text-indigo-700" : "text-gray-500")}>
              {card.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "CARD_SINGLE" || question.type === "CARD_MULTI") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.cards.map((card) => {
          const selected = isSelected(card.id);
          const c = getColor(card.color);
          return (
            <button
              key={card.id}
              onClick={() => toggle(card.id, card)}
              disabled={disabled}
              className={cn(
                "relative flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none group",
                selected
                  ? `${c.border} ${c.bg} shadow-md`
                  : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5"
              )}
            >
              <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", selected ? c.dot : "bg-gray-200 group-hover:bg-indigo-200")} />
              {card.emoji && <span className="text-2xl leading-none flex-shrink-0">{card.emoji}</span>}
              <span className={cn("text-sm font-medium flex-1", selected ? c.text : "text-gray-700")}>{card.label}</span>
              {question.type === "CARD_MULTI" && selected && (
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
              )}
              {card.drillDown && selected && (
                <span className="flex-shrink-0 text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  + why?
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "ENPS") {
    return (
      <div>
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-2 mb-3">
          {Array.from({ length: 11 }, (_, i) => {
            const selected = value[0] === String(i);
            const color = i >= 9 ? "bg-emerald-500 border-emerald-500 text-white"
              : i >= 7 ? "bg-amber-400 border-amber-400 text-white"
              : "bg-red-400 border-red-400 text-white";
            return (
              <button
                key={i}
                onClick={() => onChange([String(i)])}
                className={cn(
                  "h-12 rounded-xl border-2 text-sm font-bold transition-all duration-150",
                  selected ? color : "border-gray-200 text-gray-600 hover:border-indigo-300"
                )}
              >
                {i}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>Not likely at all</span>
          <span>Extremely likely</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        rows={4}
        maxLength={500}
        placeholder="Share your thoughts..."
        className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
        value={value[0] ?? ""}
        onChange={(e) => { setChars(e.target.value.length); onChange([e.target.value]); }}
        disabled={disabled}
      />
      <span className={cn("absolute bottom-3 right-4 text-xs", chars > 450 ? "text-red-400" : "text-gray-400")}>
        {chars}/500
      </span>
    </div>
  );
}
