<script setup>
import { ref } from 'vue';

let table = {
  title: "职业选手信息表",
  columns: [
    { name: "rank", label: "排名", align: "left", sortable: true, field: 'rank', },
    {
      name: "name",
      required: true,
      label: "姓名",
      align: "right",
      field: (row) => row.name,
      format: (val) => `${val}`,
      sortable: true,
    },
    { name: "point", label: "等级分", align: "right", sortable: true, field: 'point', },
  ],
  rows: [
    { rank: 1, name: "柯洁", point: 2705.3 },
    { rank: 2, name: "李轩豪", point: 2698.7 },
    { rank: 3, name: "杨鼎新", point: 2670.4 },
    { rank: 4, name: "范廷钰", point: 2668.4 },
    { rank: 5, name: "丁浩", point: 2668.0 },
    { rank: 6, name: "辜梓豪", point: 2662.6 },
    { rank: 7, name: "芈昱廷", point: 2662.3 },
    { rank: 8, name: "谢尔豪", point: 2650.5 },
    { rank: 9, name: "李钦诚", point: 2646.9 },
    { rank: 10, name: "李维清", point: 2630.5 },
    { rank: 11, name: "时越", point: 2622.8 },
    { rank: 12, name: "江维杰", point: 2617.5 },
    { rank: 13, name: "柁嘉熹", point: 2613.4 },
    { rank: 14, name: "谢科", point: 2613.3 },
    { rank: 15, name: "连笑", point: 2612.5 },
    { rank: 16, name: "党毅飞", point: 2598.0 },
    { rank: 17, name: "杨楷文", point: 2590.3 },
    { rank: 18, name: "赵晨宇", point: 2585.9 },
    { rank: 19, name: "陈耀烨", point: 2584.7 },
    { rank: 20, name: "许嘉阳", point: 2584.4 },
    { rank: 21, name: "廖元赫", point: 2580.8 },
    { rank: 22, name: "王檄", point: 2576.0 },
    { rank: 23, name: "彭立尧", point: 2575.0 },
    { rank: 24, name: "檀啸", point: 2574.1 },
    { rank: 25, name: "陶欣然", point: 2572.9 },
    { rank: 26, name: "黄云嵩", point: 2562.7 },
    { rank: 27, name: "唐韦星", point: 2561.8 },
    { rank: 28, name: "王星昊", point: 2559.4 },
    { rank: 29, name: "陈贤", point: 2550.3 },
    { rank: 30, name: "范胤", point: 2539.9 },
    { rank: 31, name: "童梦成", point: 2538.6 },
    { rank: 32, name: "屠晓宇", point: 2526.4 },
    { rank: 33, name: "孟泰龄", point: 2520.2 },
    { rank: 34, name: "张涛", point: 2505.9 },
    { rank: 35, name: "伊凌涛", point: 2501.8 },
    { rank: 36, name: "陈梓健", point: 2498.3 },
    { rank: 37, name: "韩一洲", point: 2496.1 },
    { rank: 38, name: "王泽锦", point: 2494.3 },
    { rank: 39, name: "周睿羊", point: 2491.5 },
    { rank: 40, name: "李铭", point: 2490.1 },
    { rank: 41, name: "戎毅", point: 2484.6 },
    { rank: 42, name: "毛睿龙", point: 2477.9 },
    { rank: 43, name: "夏晨琨", point: 2475.5 },
    { rank: 44, name: "古力", point: 2474.3 },
    { rank: 45, name: "刘星", point: 2473.0 },
    { rank: 46, name: "钟文靖", point: 2471.0 },
    { rank: 47, name: "邬光亚", point: 2469.8 },
    { rank: 48, name: "蒋其润", point: 2462.4 },
    { rank: 49, name: "孙腾宇", point: 2461.9 },
    { rank: 50, name: "谢赫", point: 2451.0 },
    { rank: 51, name: "胡跃峰", point: 2448.1 },
    { rank: 52, name: "陈玉侬", point: 2447.2 },
    { rank: 53, name: "彭荃", point: 2446.7 },
    { rank: 54, name: "王昊洋", point: 2445.8 },
    { rank: 55, name: "曹潇阳", point: 2442.4 },
    { rank: 56, name: "李翔宇", point: 2439.5 },
    { rank: 57, name: "刘宇航", point: 2434.1 },
    { rank: 58, name: "於之莹*", point: 2430.8 },
    { rank: 59, name: "廖行文", point: 2430.7 },
    { rank: 59, name: "郭闻潮", point: 2430.7 },
    { rank: 61, name: "古灵益", point: 2430.5 },
    { rank: 62, name: "常昊", point: 2429.0 },
    { rank: 63, name: "蔡竞", point: 2428.9 },
    { rank: 64, name: "何语涵", point: 2428.5 },
    { rank: 65, name: "胡耀宇", point: 2428.0 },
    { rank: 66, name: "国宇征", point: 2426.9 },
    { rank: 67, name: "罗洗河", point: 2426.0 },
    { rank: 68, name: "周贺玺", point: 2425.3 },
    { rank: 69, name: "严欢", point: 2424.6 },
    { rank: 70, name: "陈昱森", point: 2422.0 },
    { rank: 71, name: "周泓余*", point: 2421.0 },
    { rank: 72, name: "胡钰函", point: 2419.0 },
    { rank: 73, name: "汪涛", point: 2418.6 },
    { rank: 74, name: "沈沛然", point: 2411.5 },
    { rank: 75, name: "黄昕", point: 2410.4 },
    { rank: 76, name: "陈正勋", point: 2409.7 },
    { rank: 77, name: "李成森", point: 2408.8 },
    { rank: 78, name: "王晨星*", point: 2407.8 },
    { rank: 79, name: "陈浩", point: 2404.9 },
    { rank: 80, name: "张维", point: 2400.5 },
  ],
  rowKey: "name",
};

const filter = ref("")
</script>

<template>
  <q-page class="flex flex-center">
    <q-table class="rank-table" :title="table.title" :rows="table.rows" :columns="table.columns" :row-key="table.rowKey"
      :filter="filter" rows-per-page-label="每页行数" :rows-per-page-options="[10, 20, 30]">
      <template v-slot:top-right>
        <q-input bordered dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped>
.rank-table {
  width: 50%;
}
</style>
