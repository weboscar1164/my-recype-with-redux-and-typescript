import "./Forbidden.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSignIn } from "../app/hooks/hooks";

type ForbiddenContent = {
	title: string;
	message: string[];
	primary?: {
		label: string;
		action: () => void | Promise<void>;
	};
};

const Forbidden = () => {
	const [params] = useSearchParams();
	const reason = params.get("reason");
	const navigate = useNavigate();
	const { signIn } = useSignIn();

	const config: Record<string, ForbiddenContent> = {
		login: {
			title: "ログインが必要です",
			message: [
				"このページは、ログインしたユーザーのみ利用できます。",
				"アプリはポートフォリオとして一般公開していますが、",
				"一部の機能はログイン後に利用可能となっています。",
			],
			primary: {
				label: "ログインする",
				action: signIn,
			},
		},
		verify: {
			title: "認証が必要です",
			message: [
				"現在ゲストとしてログインしています。",
				"認証されたユーザーのみ利用できます。",
				"",
				"本アプリは実際に家族間で共有し、日常的に運用しています。",
			],
			primary: {
				label: "認証について",
				action: () => navigate("/about-auth"),
			},
		},
		role: {
			title: "権限がありません",
			message: [
				"このページは管理者向けの機能です。",
				"一般ユーザー向けには公開していません。",
				"",
				"アプリ全体はポートフォリオとして公開していますが、",
				"運用・管理に関わる機能は制限しています。",
			],
		},
	} as const;

	const content = config[reason as keyof typeof config] ?? config.role;
	return (
		<div className="forbidden container">
			<h1>🚫 {content.title}</h1>
			<div className="forbiddenContents">
				{content.message.map((line, i) =>
					line === "" ? <br key={i} /> : <p key={i}>{line}</p>,
				)}
			</div>

			<div className="forbiddenActions">
				{content.primary && (
					<button className="button" onClick={content.primary.action}>
						{content.primary.label}
					</button>
				)}
				<button className="button" onClick={() => navigate("/")}>
					トップへ戻る
				</button>
			</div>
		</div>
	);
};

export default Forbidden;
