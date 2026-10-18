# flow-hub

norinori-jan の個人用ツール群を「統合する」のではなく、「次に使う道具を一瞬で選ぶ」ための入口。

## Why

- quick-ref = 知識の外部記憶
- speak-native = 英語を使う
- ai-dojo = AIへの依頼能力を鍛える
- ear-first = 聴覚訓練
- table-pad = 表データ処理
- voice-pad = 音声メモ・録音
- lead-sheet = 音楽出力
- storage-check = 保存状態の監視

これらを一つの巨大アプリにすると、それぞれの良さが消える。flow-hub はルーティング層に限定する。

## Core loop

Capture → Understand → Practice → Produce → Review

## Next phase

1. 全アプリ共通の `hub_handoff_v1` JSON を定義
2. quick-ref / speak-native / ai-dojo から flow-hub へ戻る「完了」リンク
3. 共通の今日のセッション履歴
4. quick-ref の検索・知識項目を他アプリの文脈として渡す
5. GitHub Pages で公開

## Note

この初版は既存アプリをコピーせず、URLルーターと軽いセッションキューだけを持つ。データの本体は各アプリに残す。
