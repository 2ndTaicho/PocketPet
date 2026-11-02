import React, { useId } from "react";
import "./PetIllustration.css";

export default function PetIllustration({
  type = "cat",
  mood = "idle",
  accessory = "none"
}) {
  const gradientId = useId().replace(/:/g, "");
  const sleeping = mood === "sleeping";
  const happy = mood === "happy";
  const isCat = type === "cat";
  const isDog = type === "dog";
  const isBunny = type === "bunny";

  const outline = "#85777C";
  const fur = isDog ? "#F4E8D8" : "#FFFFFF";
  const shadow = isDog ? "#E1D0BC" : "#E0E4E7";
  const pink = "#CB96BA";

  return (
    <svg
      className={`pet-svg pet-${mood} pet-type-${type}`}
      viewBox="0 0 340 340"
      role="img"
      aria-label={`Cute ${type}, ${sleeping ? "sleeping" : happy ? "happy" : "awake"}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0%" stopColor={fur} />
          <stop offset="100%" stopColor={shadow} />
        </linearGradient>
      </defs>

      <ellipse
        className="pet-ground-shadow"
        cx="170"
        cy="296"
        rx="93"
        ry="13"
        fill="#77A39A"
        opacity=".2"
      />

      <g className="pet-body-motion">
        {isCat && (
          <g className="pet-tail pet-cat-tail">
            <path
              d="M230 243 C274 218 302 240 287 260 C277 275 254 272 244 264"
              fill="none"
              stroke={outline}
              strokeWidth="27"
              strokeLinecap="round"
            />
            <path
              d="M230 243 C274 218 302 240 287 260 C277 275 254 272 244 264"
              fill="none"
              stroke="#F7F7F5"
              strokeWidth="20"
              strokeLinecap="round"
            />
          </g>
        )}

        {isDog && (
          <g className="pet-tail pet-dog-tail">
            <path
              d="M220 244 Q272 217 272 249 Q271 269 249 267"
              fill="none"
              stroke={outline}
              strokeWidth="22"
              strokeLinecap="round"
            />
          </g>
        )}

        {isBunny && (
          <circle
            className="pet-bunny-tail"
            cx="238"
            cy="265"
            r="24"
            fill={fur}
            stroke={outline}
            strokeWidth="5"
          />
        )}

        <g className="pet-torso">
          <path
            d="M116 211 C96 225 96 266 113 284 C126 300 211 302 229 283 C247 261 244 223 223 207 Z"
            fill={`url(#${gradientId})`}
            stroke={outline}
            strokeWidth="5"
          />

          <path
            d="M119 248 C109 259 107 282 119 292 C131 302 149 291 151 279"
            fill={fur}
            stroke={outline}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M190 279 C192 293 211 303 224 292 C235 282 231 259 220 249"
            fill={fur}
            stroke={outline}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M157 270 C156 287 162 297 173 297 C185 297 189 287 187 270"
            fill={fur}
            stroke={outline}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </g>

        <g className="kitten-head">
          {isCat && (
            <>
              <path
                d="M90 137 C79 112 75 73 86 56 C95 43 113 52 145 78 L196 78 C229 50 248 43 258 57 C269 75 260 116 251 140"
                fill={`url(#${gradientId})`}
                stroke={outline}
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              <path
                d="M96 75 Q96 68 104 75 L136 100 Q114 109 101 126Z"
                fill={pink}
                opacity=".7"
              />
              <path
                d="M247 75 Q246 68 238 75 L205 100 Q227 109 242 126Z"
                fill={pink}
                opacity=".7"
              />
            </>
          )}

          {isDog && (
            <>
              <g className="pet-left-ear">
                <path
                  d="M102 105 C62 62 43 99 65 158 C78 191 98 169 112 135Z"
                  fill="#D5BDA6"
                  stroke={outline}
                  strokeWidth="5.5"
                />
              </g>
              <g className="pet-right-ear">
                <path
                  d="M238 105 C278 62 297 99 275 158 C262 191 242 169 228 135Z"
                  fill="#D5BDA6"
                  stroke={outline}
                  strokeWidth="5.5"
                />
              </g>
            </>
          )}

          {isBunny && (
            <>
              <g className="pet-left-ear">
                <ellipse
                  cx="122"
                  cy="70"
                  rx="27"
                  ry="70"
                  transform="rotate(-12 122 70)"
                  fill={fur}
                  stroke={outline}
                  strokeWidth="5.5"
                />
                <ellipse
                  cx="122"
                  cy="69"
                  rx="13"
                  ry="49"
                  transform="rotate(-12 122 69)"
                  fill={pink}
                  opacity=".65"
                />
              </g>
              <g className="pet-right-ear">
                <ellipse
                  cx="218"
                  cy="70"
                  rx="27"
                  ry="70"
                  transform="rotate(12 218 70)"
                  fill={fur}
                  stroke={outline}
                  strokeWidth="5.5"
                />
                <ellipse
                  cx="218"
                  cy="69"
                  rx="13"
                  ry="49"
                  transform="rotate(12 218 69)"
                  fill={pink}
                  opacity=".65"
                />
              </g>
            </>
          )}

          <path
            d="M87 133 C78 142 71 160 75 181 C78 201 90 211 102 218
               C109 235 133 245 153 244 C165 250 181 250 193 244
               C218 247 239 235 246 218 C266 208 274 189 269 168
               C267 149 258 137 251 131 C245 112 225 101 207 98
               C194 88 182 91 171 93 C158 90 145 89 132 98
               C111 99 94 112 87 133Z"
            fill={`url(#${gradientId})`}
            stroke={outline}
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

          {isDog && (
            <>
              <ellipse
                cx="112"
                cy="139"
                rx="30"
                ry="32"
                fill="#D5BDA6"
                opacity=".55"
              />
              <ellipse
                cx="225"
                cy="139"
                rx="28"
                ry="30"
                fill="#D5BDA6"
                opacity=".45"
              />
            </>
          )}

          <g className="pet-cheeks">
            <ellipse
              cx="111"
              cy="181"
              rx="19"
              ry="12"
              fill={pink}
              opacity=".38"
            />
            <ellipse
              cx="229"
              cy="181"
              rx="19"
              ry="12"
              fill={pink}
              opacity=".38"
            />
          </g>

          {sleeping ? (
            <g
              fill="none"
              stroke={outline}
              strokeWidth="5.5"
              strokeLinecap="round"
            >
              <path d="M119 159 Q137 175 153 158" />
              <path d="M189 158 Q206 175 224 159" />
            </g>
          ) : happy ? (
            <g
              fill="none"
              stroke={outline}
              strokeWidth="5.5"
              strokeLinecap="round"
            >
              <path d="M120 162 Q136 142 151 162" />
              <path d="M191 162 Q207 142 222 162" />
            </g>
          ) : (
            <g className="pet-blinking-eyes">
              <g className="pet-open-eyes">
                <ellipse
                  cx="136"
                  cy="160"
                  rx="10"
                  ry="13"
                  fill={outline}
                />
                <ellipse
                  cx="206"
                  cy="160"
                  rx="10"
                  ry="13"
                  fill={outline}
                />
                <ellipse
                  cx="133"
                  cy="155"
                  rx="3.5"
                  ry="4.5"
                  fill="#FFFFFF"
                />
                <ellipse
                  cx="203"
                  cy="155"
                  rx="3.5"
                  ry="4.5"
                  fill="#FFFFFF"
                />
              </g>
              <g
                className="pet-closed-eyes"
                fill="none"
                stroke={outline}
                strokeWidth="5.5"
                strokeLinecap="round"
              >
                <path d="M120 160 Q136 173 152 160" />
                <path d="M190 160 Q206 173 222 160" />
              </g>
            </g>
          )}

          {isDog ? (
            <ellipse
              cx="171"
              cy="183"
              rx="10"
              ry="7"
              fill={outline}
            />
          ) : (
            <path
              d="M161 179 Q171 172 181 179 Q179 187 171 188 Q163 187 161 179Z"
              fill={pink}
            />
          )}

          <path
            d={
              happy
                ? "M171 190 Q155 211 145 190 M171 190 Q187 211 197 190"
                : "M171 190 Q161 202 151 191 M171 190 Q181 202 191 191"
            }
            fill="none"
            stroke={outline}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {isCat && (
            <g
              fill="none"
              stroke="#A99AA0"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <path d="M111 191 L80 185 M112 202 L84 207" />
              <path d="M231 191 L262 185 M230 202 L258 207" />
            </g>
          )}

          {accessory === "bow" && (
            <g transform="translate(232 107) rotate(17)">
              <path
                d="M0 0 C-29 -29 -43 -19 -38 1 C-33 22 -15 19 0 7
                   C15 19 33 22 38 1 C43 -19 29 -29 0 0Z"
                fill={pink}
                stroke={outline}
                strokeWidth="4"
              />
              <ellipse
                cx="0"
                cy="3"
                rx="9"
                ry="10"
                fill="#B0B3D6"
                stroke={outline}
                strokeWidth="3"
              />
            </g>
          )}

          {accessory === "flower" && (
            <g transform="translate(231 104)">
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-15"
                  rx="11"
                  ry="16"
                  transform={`rotate(${angle})`}
                  fill={pink}
                  stroke={outline}
                  strokeWidth="2.5"
                />
              ))}
              <circle
                r="9"
                fill="#D0DDC4"
                stroke={outline}
                strokeWidth="2.5"
              />
            </g>
          )}
        </g>
      </g>

      {sleeping && (
        <g
          className="pet-sleep-symbols"
          fill="#B0B3D6"
          fontFamily="Georgia, serif"
          fontWeight="bold"
        >
          <text x="265" y="105" fontSize="21">z</text>
          <text x="282" y="84" fontSize="28">z</text>
          <text x="303" y="58" fontSize="35">Z</text>
        </g>
      )}

      {happy && (
        <g className="pet-happy-sparkles" fill={pink}>
          <path d="M64 112 L68 123 L80 127 L68 131 L64 143 L60 131 L48 127 L60 123Z" />
          <path d="M282 146 L286 156 L296 160 L286 164 L282 174 L278 164 L268 160 L278 156Z" />
        </g>
      )}
    </svg>
  );
}
