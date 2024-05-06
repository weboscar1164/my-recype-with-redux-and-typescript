import React from "react";
import "./Recipe.scss";

const Confirm = () => {
	return (
		<div className="recipe">
			<div className="recipeContainer">
				<h2>確認画面</h2>
				<h3>オーブンを使ったハンバーグ</h3>
				{/* <div className="recipeTag">
					<ul>
						<li>ハンバーグ</li>
						<li>オーブン</li>
						<li>ひき肉</li>
					</ul>
				</div> */}
				<p className="recipeImg">
					<img src="20200501_noimage.jpg" alt="" />
				</p>
				<section className="recipeInfo">
					<h3>Comment</h3>
					<p>オーブンを使った失敗しにくいハンバーグです</p>
				</section>

				<section className="recipeMaterial">
					<h3>材料4人分</h3>
					<ul>
						<li>
							<div className="recipeMaterialGroup"></div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">合いびき肉</div>
								<div className="recipeMaterialQuantity">600g</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup"></div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">玉ねぎ</div>
								<div className="recipeMaterialQuantity">1玉</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup">◯</div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">パン粉</div>
								<div className="recipeMaterialQuantity">1カップ</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup">◯</div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">牛乳</div>
								<div className="recipeMaterialQuantity">大さじ4</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup">★</div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">醤油</div>
								<div className="recipeMaterialQuantity">大さじ4</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup">★</div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">みりん</div>
								<div className="recipeMaterialQuantity">大さじ4</div>
							</div>
						</li>
						<li>
							<div className="recipeMaterialGroup">★</div>
							<div className="recipeMaterialContents">
								<div className="recipeMaterialName">砂糖</div>
								<div className="recipeMaterialQuantity">大さじ2</div>
							</div>
						</li>
					</ul>
				</section>

				<section className="recipeProcedure">
					<h3>作り方</h3>
					<ol>
						<li>ひき肉は塩ひとつまみを入れ、粘りが出るまでこねる</li>
						<li>玉ねぎをフードプロセッサーに入れてみじん切りにする</li>
						<li>2で刻んだ玉ねぎと◯を入れよくこねる</li>
						<li>
							形を整えた3を熱したフライパンに乗せ、両面に焼き目がつくまで焼く
						</li>
						<li>オーブンに入れ、250度で9分焼く</li>
						<li>
							オーブンで焼いている間にフライパンに残った油に★を入れて熱する
						</li>
					</ol>
				</section>
				<div className="recipeSubmit">
					<button>再編集</button>
					<button>確定</button>
				</div>
			</div>
		</div>
	);
};

export default Confirm;
