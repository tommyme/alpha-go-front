#!/bin/sh

OUTFILE="js/all.concated.js"
RHINOC="cat"

rm $OUTFILE

$RHINOC js/lang.js >> $OUTFILE 2>&1         # 修改prototype
$RHINOC js/eidogo.js >> $OUTFILE 2>&1       # 对象指针  ccc = window.ccc || {}   window的ccc对象被赋值
$RHINOC js/util.js >> $OUTFILE 2>&1         # 添加edg.util属性
$RHINOC i18n/en.js >> $OUTFILE 2>&1         # 添加i18n属性
$RHINOC js/gametree.js >> $OUTFILE 2>&1     # 添加game相关的东西
$RHINOC js/sgf.js >> $OUTFILE 2>&1          # 添加sgfParser
$RHINOC js/board.js >> $OUTFILE 2>&1        # 
$RHINOC js/rules.js >> $OUTFILE 2>&1
$RHINOC js/player.js >> $OUTFILE 2>&1
$RHINOC js/init.js >> $OUTFILE 2>&1         # window触发load事件的时候加载eidogo
