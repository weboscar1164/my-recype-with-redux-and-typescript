import { Drawer } from "@mui/material";
import "./JsonImportGuideDrawer.scss";
import { useAppDispatch } from "../app/hooks/hooks";
import { openPopup } from "../features/popupSlice";

const PROMPT_TEXT = `次の内容を要約し、以下のテンプレートに従ってjsonファイルにまとめてください。
{"recipeName":str,
"materials":[
{"group":int,
"name":str,
"quantity":str},...],
"procedures":[
str,str,...],
"serves":int
}

条件
合わせ調味料などはグループに分けてください
groupのデフォルトは0
以下の条件でグループ分け
1,★ 2,☆ 3,● 4,◯ 5,◎

グループの記号を作り方に反映させて、簡潔にまとめてください

変換する文章：`;

const JSON_SAMPLE = `{
  "recipeName": "肉じゃが",
  "materials": [
    { "group": 0, "name": "じゃがいも", "quantity": "3個" },
    { "group": 0, "name": "牛肉", "quantity": "200g" },
    { "group": 1, "name": "醤油", "quantity": "大さじ2" }
  ],
  "procedures": [
    "じゃがいもを切る",
    "牛肉を炒める",
    "★の調味料を加えて煮る"
  ],
  "serves": 2
}`;

type Props = {
	open: boolean;
	onClose: () => void;
};

const JsonImportGuideDrawer = ({ open, onClose }: Props) => {
	const dispatch = useAppDispatch();

	const handleCopy = async () => {
		await navigator.clipboard.writeText(PROMPT_TEXT);
		dispatch(openPopup({ message: "コピーしました。", action: "success" }));
	};
	return (
		<Drawer
			PaperProps={{
				className: "drawerPaper",
			}}
			anchor="bottom"
			open={open}
			onClose={onClose}
		>
			<section className="drawer">
				<div className="container drawerContainer">
					<header>
						<h2>🧾 JSON取り込みについて</h2>
					</header>

					<article>
						<h3>✅ このアプリはJSON取り込みに対応しています</h3>
						<p>
							レシピサイトなどの文章を、生成AIを使ってJSON形式に変換し、
							ファイルとして取り込むことでフォームへ自動入力できます。
						</p>
					</article>

					<hr />

					<section>
						<h3>🔄 手順</h3>

						<ul>
							<li>
								<h4>① レシピ文章をコピー</h4>
								<p>レシピサイトなどの本文をコピーしてください。</p>
							</li>

							<li>
								<h4>② 下のプロンプトと一緒に生成AIへ入力</h4>
								<p>（ChatGPTなどに貼り付け）</p>
							</li>

							<li>
								<h4>③ 出力されたJSONをファイル保存</h4>
								<ul>
									<li>新規テキストファイルを作成</li>
									<li>
										拡張子を <code>.json</code> に変更
									</li>
									<li>出力されたJSONをそのまま貼り付けて保存</li>
								</ul>
							</li>

							<li>
								<h4>④ 「ファイル取り込み」ボタンを押す</h4>
								<p>
									先ほど保存したJSONファイルを選択してください。
									<br />
									→ フォームに自動入力されます
									<br />→ 内容を確認して確認画面へ進んでください
								</p>
							</li>
						</ul>
					</section>

					<hr />

					<section>
						<h3>📋 使用プロンプト</h3>

						<textarea readOnly value={PROMPT_TEXT}></textarea>
						<div>
							<button type="button" onClick={handleCopy}>
								📋 プロンプトをコピー
							</button>
						</div>
					</section>

					<hr />

					<section>
						<details>
							<summary>JSON例を見る</summary>
							<pre>{JSON_SAMPLE}</pre>
						</details>
					</section>

					<footer>
						<p>※うまく読み込めない場合はJSON形式を確認してください。</p>

						<div>
							<button type="button" onClick={onClose}>
								閉じる
							</button>
						</div>
					</footer>
				</div>
			</section>
		</Drawer>
	);
};

export default JsonImportGuideDrawer;
