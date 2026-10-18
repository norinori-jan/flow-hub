# flow-hub Architecture v2

## 目的
flow-hub はアプリを一つに統合する場所ではなく、**目的・状態・次の一手を統合するコックピット**。

原則:
1. 専門アプリの責務を奪わない
2. 原本データは各専門アプリ側に置く
3. flow-hub は次にどこへ行くかを決める
4. flow-mind は意味・意図・因果・本音のレイヤー
5. music-suite は音楽制作の中核、lead-sheet は軽量な出力・共有ツール
6. アプリ間連携は共通 handoff 形式を使う

## レイヤー

### L0: flow-hub — Navigation
今日の目的、現在の状態、次のアプリ、セッション履歴、handoffを担当。音符・感情グラフ・長期知識・録音原本は持たない。

### L1: flow-mind — Meaning / Intent
現在のflow-mindは因果グラフ、神経発火シミュレーション、attractor、PageRank、AI分析、本音抽出、他アプリとのtransferを持つ。この強みを使い、flow-hubからは「作業前の意図整理」「作業後の振り返り」の入口にする。

flow-mindのグラフはflow-mindが原本。flow-hubへはintent / emotion / focus / summaryなど必要最小限だけ渡す。

### L2: Knowledge / Practice
- quick-ref: 第二の脳・知識の終着駅
- ai-dojo: AIへの依頼能力
- speak-native: 英語運用
- ear-first: 聴覚訓練

基本ループ: capture → understand → practice → review → quick-ref

### L3: Production

音楽は次の責務分離にする。

```text
voice / idea
    ↓
vocal-lab / canvas / chord-lab / beat-lab
    ↓
music-suite  ← 音楽制作の中心
    ↓
score-editor / MIDI / 外部DAW
    ↓
lead-sheet    ← リードシート化・軽量共有・印刷
```

**lead-sheetをmusic-suiteに吸収しない。music-suiteを上位の制作環境にする。**
lead-sheetは完成した音楽データを人間が読めるコード＋メロディの形にする用途として残す。

## 共通handoff: hub_handoff_v1

最初から巨大な共通DBを作らず、小さなJSONを受け渡す。

```json
{
  "protocol": "hub_handoff_v1",
  "id": "uuid",
  "createdAt": "ISO8601",
  "source": "flow-hub",
  "sourceRef": "optional-app-specific-reference",
  "intent": "何をしたいか",
  "context": {
    "text": "任意の短い文",
    "tags": [],
    "emotion": null,
    "focus": null
  },
  "payload": {},
  "next": { "app": "quick-ref", "action": "open" },
  "returnTo": "flow-hub"
}
```

必須: protocol / id / createdAt / source / intent
任意: sourceRef / context / payload / next / returnTo

専門データはpayloadへ無理に統合しない。必要ならURL、localStorageキー、プロジェクトIDなどの参照を渡す。

## アプリ間handoff

| from | to | 渡すもの |
|---|---|---|
| flow-mind | quick-ref | intent / emotion / focus / summary |
| flow-mind | music-suite | emotion / concept / motif / notes reference |
| quick-ref | ai-dojo | 問い / 背景 / 制約 |
| quick-ref | speak-native | 学習対象 / フレーズ / 文脈 |
| voice-pad | flow-mind | 音声メモ参照 + 文字起こし（あれば） |
| voice-pad | music-suite | 音声素材参照 |
| vocal-lab等 | music-suite | 音楽プロジェクト参照 |
| music-suite | lead-sheet | melody / chords / project reference |
| music-suite | flow-mind | 制作テーマ・感情・振り返り |
| table-pad | quick-ref | 集計結果・表の要約 |

## セッションモデル

```text
Session
 ├─ goal
 ├─ startedAt
 ├─ currentStage
 ├─ handoffs[]
 ├─ completed[]
 └─ review
```

currentStage: capture / understand / practice / produce / review

## 音楽ワークフロー

### 思いつきから曲にする
flow-mind → concept / emotion / intention → voice-pad or vocal-lab → music-suite → lead-sheet

### コード進行から作る
chord-lab → music-suite → score-editor → lead-sheet

### 既存曲を共有する
music-suite → lead-sheet → PDF / image / MusicXML / share

### 作った曲を振り返る
music-suite → flow-mind → review → quick-ref

## UI

トップは「アプリ一覧」より「目的」を上に置く。

1. 今の目的 / 続きから再開 / 今日のセッション
2. 整理する / 学ぶ / 作る / 収録する / 整える
3. 専門アプリ一覧

## 実装順

### Phase 1
- flow-hub公開
- flow-mind / music-suite登録
- 音楽の入口をmusic-suiteへ変更

### Phase 2
- hub_handoff_v1
- 「完了して戻る」
- セッション履歴

### Phase 3
- flow-mind ↔ flow-hub
- quick-ref ↔ flow-hub
- music-suite ↔ flow-hub

### Phase 4
- 今日の流れの自動提案
- 直近の未完了タスク
- 次にやることランキング

### Phase 5
- 横断検索
- 原本データは統合DBへ移行しない
- 必要な時だけ各アプリを参照

## やらないこと
- 全アプリを巨大HTMLにする
- 全データをflow-hubへコピーする
- music-suiteとlead-sheetを無理に統合する
- flow-mindを単なる気分メモにする
- localStorageキーを無秩序に共有する
- AIに全部判断させる

最終的な思想は、**アプリを増やしても迷子にならない個人OS**。
