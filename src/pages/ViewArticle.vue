<script setup>
import { ref } from 'vue'
const articleContent = ref(`
<div class="con" style="line-height:30px;padding:10px 5px; font-size:15px;"><div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043718341.jpg" /><br />
李钦诚中盘胜谢尔豪，夺得第23届阿含&middot;桐山杯冠军</div>
　　12月16日，第23届阿含&middot;桐山杯中国围棋快棋赛决赛在浙江平湖永年阁进行，李钦诚九段执黑中盘战胜谢尔豪九段，夺得冠军，同时获得了20万元冠军奖金，谢尔豪获得亚军及8万元奖金。李钦诚将于17日代表中国参加第23届阿含&middot;桐山杯中日围棋快棋冠军对抗赛，对手是日本第29届阿含&middot;桐山杯快棋赛冠军平田智也七段。
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043815918.jpg" /><br />
谢尔豪 VS 李钦诚</div>
<div>　　本局在前边大部分时间里都是谢尔豪白棋占据优势，序盘不久就开始领先的谢尔豪，在棋局进行到140余手时胜率已达98%。</div>
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043718419.png" /><br />
白胜率98%</div>
<div>　　不料，官子阶段两人开始交替出现失误，胜率来回大幅波动。最终谢尔豪下出178、180的败着，局势遂告不治。</div>
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043718867.png" /><br />
178应于A位，180如在中腹尖尚可支撑</div>
<div>　　实战由于白棋右下联络有缺陷，导致中腹白数子被李钦诚劫杀，至219手谢尔豪认输，李钦诚首次夺得阿含&middot;桐山杯冠军。</div>
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043815609.jpg" /><br />
局后复盘</div>
<div>　　17日12时，将进行第23届阿含&middot;桐山杯中日围棋快棋冠军对抗赛，由李钦诚对阵平田智也，比赛采用日本围棋规则，每方1小时后一次30秒读秒。弈城网将继续进行棋谱直播，并由杜夫子在线文字讲解。（曲江 现场图片：新浪）</div>
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043718145.png" /></div>
<div style="text-align: center;"><img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043815773.jpg" /></div>
<div style="text-align: center;">谢尔豪九段<br style="text-align: center;" />
<img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216043815588.jpg" style="text-align: center;" /><br />
李钦诚九段<br />
<img src="http://www.eweiqi.com/uploadfile/2022/1216/20221216044039459.jpg" /><br />
永年阁</div>
</div> `)
</script>

<template>
  <q-page class="flex flex-center">
    <article style="flex-basis: 50%;" v-html="articleContent">
    </article>
  </q-page>
</template>


<style scoped></style>
