import React from "react"
export default function Owl({state}) {
  return <svg className={'owl owl-' + state} viewBox="0 0 340 275" role="img" aria-label="Bibi the owl">
    <defs>
      <linearGradient id="body-orange" x2=".22" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#ff9a65"/><stop offset=".72" stopColor="#ed674b"/><stop offset="1" stopColor="#dc4e38"/></linearGradient>
      <linearGradient id="owl-belly" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#fff8e9"/><stop offset="1" stopColor="#ffdcae"/></linearGradient>
      <linearGradient id="wing" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#f98554"/><stop offset="1" stopColor="#d64b3d"/></linearGradient>
    </defs>
    <ellipse className="owl-shadow" cx="170" cy="247" rx="81" ry="12" fill="#91462a" opacity=".12"/>
    <g className="owl-waves" fill="none" stroke="#11976f" strokeWidth="4" strokeLinecap="round"><path d="M56 103q-15 20 0 40m-12-49q-22 29 0 58M284 103q15 20 0 40m12-49q22 29 0 58"/></g>
    <g className="owl-body">
      <path fill="#ed9140" d="M141 224c-16 0-29 8-29 16 0 8 27 10 43 1l3-11zm58 0c16 0 29 8 29 16 0 8-27 10-43 1l-3-11z"/>
      <path className="owl-ear" fill="url(#body-orange)" d="M106 99c-9-20-12-42-10-62 1-6 5-9 11-5 15 9 30 23 39 45zm128 0c9-20 12-42 10-62-1-6-5-9-11-5-15 9-30 23-39 45z"/>
      <path fill="#ffb38b" d="M108 46c12 10 19 19 24 30l-19 8c-4-12-6-24-5-38zm124 0c-12 10-19 19-24 30l19 8c4-12 6-24 5-38z"/>
      <path fill="url(#body-orange)" d="M170 62c-48 0-82 34-83 91-2 55 30 83 83 83s85-28 83-83c-1-57-35-91-83-91z"/>
      <path className="owl-wing left-wing" fill="url(#wing)" d="M98 146c-23 9-36 32-34 54 1 9 8 10 14 7 21-9 28-23 30-41z"/>
      <path className="owl-wing right-wing" fill="url(#wing)" d="M242 146c23 9 36 32 34 54-1 9-8 10-14 7-21-9-28-23-30-41z"/>
      <path fill="url(#owl-belly)" d="M170 111c-14-22-43-28-59-11-19 18-13 45 1 59-18 35 11 65 58 65s76-30 58-65c14-14 20-41 1-59-16-17-45-11-59 11z"/>
      <path d="M140 187q8 9 16 0m27 0q8 9 16 0m-37 14q8 9 16 0" fill="none" stroke="#e9a876" strokeWidth="3" strokeLinecap="round" opacity=".72"/>
      <g className="owl-eyes"><ellipse cx="139" cy="131" rx="11" ry="15" fill="#302239"/><ellipse cx="201" cy="131" rx="11" ry="15" fill="#302239"/><circle cx="142" cy="126" r="3.5" fill="#fff"/><circle cx="204" cy="126" r="3.5" fill="#fff"/></g>
      <g className="owl-stars" fill="#ffac36"><path d="m139 117 4 9 10 5-10 4-4 10-4-10-10-4 10-5zm62 0 4 9 10 5-10 4-4 10-4-10-10-4 10-5z"/></g>
      <ellipse cx="123" cy="154" rx="10" ry="5.5" fill="#f7aa9f"/><ellipse cx="217" cy="154" rx="10" ry="5.5" fill="#f7aa9f"/>
      <ellipse className="owl-mouth" cx="170" cy="157" rx="10" ry="8" fill="#883b39"/>
      <path d="M158 146c0-5 5-9 12-9s12 4 12 9l-10 9a3 3 0 0 1-4 0z" fill="#ffab49"/>
      <path d="M161 144q5-4 10-4" stroke="#ffd98c" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M151 82q9-9 19-8m4 8q6-5 12-4" stroke="#ffc09b" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </g>
  </svg>
}
