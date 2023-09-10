import { Image } from '@mantine/core'

interface StepContentProps {
  title: string
  img: string
  children: React.ReactNode
}
const StepContent: React.FC<StepContentProps> = ({ title, img, children }: StepContentProps) => {
  return (
    <div>
      <h4>{title}</h4>
      <Image
        maw={50}
        mx="auto"
        radius="md"
        src={img}
        alt="image"
        pos="absolute"
        style={{ top: 40, right: 30 }}
      />
      <div className="tour-description">{children}</div>
    </div>
  )
}

const overTour = () => {
  localStorage.setItem('isOverTour', JSON.stringify(true))
}
export const getIsOverTour = () => {
  return localStorage.getItem('isOverTour')
}

export const steps = [
  {
    selector: '.dummy',
    content: () => (
      <StepContent title="ツアーの開始" img="/images/logo.jpg">
        <p>ポモドーロアドベンチャーへようこそ！</p>
        <br />
        <p>
          ポモドーロアドベンチャーは、<b>ポモドーロテクニックをサポートするツール</b>だよ。
        </p>
        <p>
          <b>BGMやビジュアルによるモチベーションの向上、ログ・グラフによる努力の可視化</b>
          ができる、君だけの冒険の書だよ。
        </p>
        <br />
        <p>ポモドーロテクニック:25分集中して少しの休憩を繰り返し、作業効率を高める時間管理術</p>
        <br />
        <p>最初に使い方のツアーを始めよう。</p>
      </StepContent>
    ),
    styles: {
      popover: (base: { [key: string]: any }) => ({
        ...base,
        borderRadius: '20px',
        top: '30%',
        left: '33%',
        maxWidth: '600px',
      }),
    },
  },
  {
    selector: '.quest-area',
    content: () => (
      <StepContent title="クエスト" img="https://img.icons8.com/stickers/100/quest.png">
        <p>まずはクエストを登録してみよう。</p>
        <p>
          ここでのクエストとは、<b>努力したい=冒険したいことだよ。</b>
          例えば、「仕事」「読書」「勉強」「HP制作」「家事」「筋トレ」みたいに、大きなカテゴリを入力してね。
        </p>
        <br />
        <p>
          チュートリアルとして、<b>まずは1件入力して、「保存」</b>を押してみよう。
        </p>
        <p>保存できたら「→」を押してツアーの次のページに進んでね。</p>
        <p>(ちなみに最大５件まで。目標は絞ろう。人生は有限だよ。)</p>
      </StepContent>
    ),
  },
  {
    selector: '.enemy-area',
    content: () => (
      <StepContent title="エネミー" img="https://img.icons8.com/stickers/100/kawaii-dinosaur.png">
        <p>クエストに挑む時、毎回エネミーを入力できるよ。</p>
        <p>
          <b>今回のセット=25分で倒したい敵(作業)</b>
          ってとこかな。例えば、「"吾輩は猫でありトマトではない"を読む」とかね。
        </p>
        <p>必須ではないので、より細かく記録したい場合入力してみてね。</p>
      </StepContent>
    ),
  },
  {
    selector: '.image-area',
    content: () => (
      <StepContent title="画像" img="https://img.icons8.com/stickers/100/gallery.png">
        <p>なんかいい感じの画像を表示しとくね。</p>
        <p>
          ポモドーロがスタートしたり、終了したりすると画像が変わるよ。何パターンかあるので、何度も作業しようね。
        </p>
      </StepContent>
    ),
  },
  {
    selector: '.timer-area',
    content: () => (
      <StepContent title="タイマー" img="https://img.icons8.com/stickers/100/time.png">
        <p>
          ここで<b>タイマーをスタート</b>して、ポモドーロの世界へGO！
        </p>
        <p>
          <b>どのクエストを行うか、「QUEST LIST」でチェックするのを忘れない</b>でね。
        </p>
        <p>BGMも流れるから、好きなものを選んで。邪魔だったら音量ゼロにしたらいいよ。</p>
        <br />
        <p>ポモにゃんのおすすめは「雨粒とナイロンギター」かな。</p>
        <p>BGMがあると、集中力も高まるよね。</p>
      </StepContent>
    ),
  },
  {
    selector: '.nav-button',
    content: () => (
      <StepContent
        title="本めくりボタン"
        img="https://img.icons8.com/stickers/100/storytelling.png"
      >
        <p>おっと、忘れてた。</p>
        <p>ここでページをめくれるよ。</p>
        <p>
          次のページでは<b>ポモドーロの記録が見れたり、グラフで君の頑張りが視覚化</b>
          されてるよ。
        </p>
        <br />
        <p>
          あ、そうそう、25分1セット達成でクエストのレベルが1上がるよ。
          <b>途中で離脱すると中断になってレベルや経過時間は記録しない</b>
          から気をつけて。シビアにいくよ。
        </p>
        <br />
        <p>…じゃあこれでツアーも終わりだよ。君だけのポモドーロの旅にいってらっしゃい！！</p>
      </StepContent>
    ),
    actionAfter: overTour,
  },
]
