<template>
    <div class="audioPlayerPage" :style="{background:`#14277a  url(${audio.playerbg}) 0 0 /100% 100%`}">
        <div class="popwindow" :class="{cur:isShowPlayList}" @click="isShowPlayListBtn"></div>
        <header>
            <span class="iconfont icon-houtui1" @click="goBack"></span>
            <!-- 需要判断index的下标类型显示相应的歌曲名字 -->
            {{typeof audio.index == 'number' ? audio.album[audio.index].musicName :'播放器'}}
        </header>
        <span v-if="typeof audio.index == 'number'">
            <audio :src="audio.album[audio.index].musicUrl" autoplay class="audio" @timeupdate="play"></audio>
        </span>
        <!-- 碟盘 -->
        <div class="content" v-if="!isShowLyric" @click="showLyric">
            <div class="cd">
                <img src="../../static/img/cd.png">
                <div class="singerbg" :class="{cur:isPlay}">
                    <img :src="audio.albumImg">
                </div>
            </div>
            <div class="swith" :class="{cur:isPlay}">
                <img src="../../static/img/swith.png">
            </div>
        </div>

        <!-- 歌词盒子 -->
        <div class="lyric" v-if="isShowLyric" @click="hideLyric" v-height="280">
            <ul>
                <!-- 当前播放时间 > 当前这行歌词语句的时间 就加cur类 -->
                <!-- 并且当前播放时间 + 当前行歌词的时间（下一行减去当前行 就是本句唱了多少秒）-->
                <!-- 但下一行不能超过歌词总数：大不能超过数组的长度，小不能小于0 -->
                <!-- index+1 > lyric.length-1 ? lyric.length-1 : index + 1-->
                <li v-for="(item,index) in lyric"
                    :class="{cur:currentTime > lyric[index][0] && currentTime + (lyric[index][0] - lyric[index+1 > lyric.length-1 ? lyric.length-1 : index + 1][0]) < lyric[index][0]}"
                >
                    <span class="animationLyric_origin">
                        {{item[1]}}
                        <!-- {{index <= 0 ? 0 : index+1 > lyric.length-1 ? lyric.length-1 : index + 1}} -->
                        <span class="animationLyric_current"
                            :style="[
                                {'animation-play-state':isPlay ? 'running':'paused'},
                                {'animation-duration':lyric[index+1 > lyric.length-1 ? lyric.length-1 : index + 1][0] - lyric[index][0] + 's'}
                            ]">
                            {{item[1]}}
                        </span>
                    </span>
                </li>
            </ul>
        </div>

        <!-- 分割线 -->
        <ul class="setting">
            <li class="iconfont icon-xin1"></li>
            <li class="iconfont icon-icon--"></li>
            <li class="iconfont icon-BAI-pinglun"></li>
            <li class="iconfont icon-more-vert"></li>
        </ul>
        <div class="progressBar">
            <p class="start">{{currentTime | zhuanhuan}}</p>
            <p class="range">
                <span class="duration" @click="goToTime($event)">
                    <span class="currentTime" :style="{width:currentTime / duration * 100+'%'}"></span>
                </span>
            </p>
            <p class="end">{{duration | zhuanhuan}}</p>
        </div>
        <div class="controller">
            <p class="playModeBtn iconfont" @click="changePlayState"
               :class="[
                 {'icon-xunhuan':playState === 'all'},
                 {'icon-singlecycle':playState === 'once'},
                 {'icon-bofangye-caozuolan-suijibofang':playState === 'random'},
               ]"
            >
            </p>
            <ul>
                <li class="iconfont icon-previous" @click="goPrev()"></li>
                <li class="iconfont" @click="pause_play"
                    :class="[isPlay == true ? 'icon-pause-20' : 'icon-bofang']"
                >
                </li>
                <li class="iconfont icon-next" @click="goNext()"></li>
            </ul>
            <p class="playListBtn iconfont icon-zhankaicaidan" @click="isShowPlayListBtn"></p>
        </div>

        <div class="playList" :class="{cur:isShowPlayList}">
            <ul>
                <li v-for="(item,index) in audio.album"
                    :class="{cur:index == audio.index}"
                    @click="playList(index)"
                >
                    <span class="iconfont laba"
                        :class="{'icon-laba':index == audio.index}"
                        :style="{fontSize:index != audio.index ? '14px' : '28px'}"
                    >
                        {{index + 1}}
                    </span>
                    <span>{{item.musicName}}</span>
                </li>
                <footer>
                    <span class="iconfont icon-guanbi" @click="isShowPlayListBtn"></span>
                </footer>
            </ul>
        </div>
    </div>
</template>
<script>
     export default {
        props:["audio"],
        data(){
            return {
                isShowPlayList: false,
                isPlay:true,    //因为audio标签有autopsy所以默认是播放的（加cur）
                duration:0,     //歌曲的总时长
                currentTime:0,  //当前播放时间
                isAddClss:true, //需要一个量去控制什么时候加类
                playState:'all', //播放模式 all once random
                isShowLyric:false, //是否显示歌词
                lyric:[]           //存放歌词
            }
        },
        computed:{
            playerIndex(){
                return this.audio.index;
            }
        },
        filters:{
            zhuanhuan(s){
                var t;
                if(s > -1){
                    var min = Math.floor(s/60) % 60;
                    var sec = s % 60;

                    if(min < 10){t += "0";}
                    t = min + ":";
                    if(sec < 10){t += "0";}
                    t += ~~sec;
                }
                return t;
            }
        },
        methods:{
            goBack(){
                this.$store.commit("ShowOrHidePlayer",{isShowAudio:false})
            },
            isShowPlayListBtn(){
                this.isShowPlayList = !this.isShowPlayList;
            },
            //每帧都在执行这个方法
            play(){
                this.duration = $(".audio")[0].duration;  //获取音频的总时长
                this.currentTime = $(".audio")[0].currentTime; //获取音频的当前播放时间
                console.log(this.currentTime)
                if($('.audio')[0].paused && this.isAddClss){
                    this.isPlay = false;
                    this.isAddClss = false;
                }else{
                    this.isPlay = true;
                }

                //ended 返回当前音频是否已结束
                //如果当前歌曲播放完毕，返回true
                if($(".audio")[0].ended){
                    if(this.playState === 'all'){ //顺序播放
                        if(this.audio.index >= this.audio.album.length - 1){
                            this.changeMusic(0);
                        }else{
                            this.changeMusic(this.audio.index + 1)
                        }
                    }else if(this.playState === 'once'){  //单曲循环
                        this.changeMusic(this.audio.index);
                        $(".audio")[0].load(); //重新加载
                    }else if(this.playState === 'random'){ //随机播放
                        let index = ~~(Math.random() * this.audio.album.length);
                        this.changeMusic(index)
                    }
                }

                //歌词向上滚动
                for(var i = 0; i < this.lyric.length;i++){
                    if(this.currentTime > this.lyric[i][0]){
                        $(".lyric ul").css('top', $('.lyric').height() / 2 - 26 * (i + 1))
                        // $(".lyric li").removeClass('cur');
                        // $(".lyric li").eq(i).addClass('cur');
                    }
                }
            },
            pause_play(){
                this.isPlay = !this.isPlay;
                if(this.isPlay == false){
                    $(".audio")[0].pause(); //暂停
                    this.isAddClss = true;
                }else{
                    $(".audio")[0].play(); //播放
                }
            },
            changePlayState(){
                //点击切换播放模式
                if(this.playState === 'all'){
                    this.playState = 'random';
                }else if(this.playState === 'random'){
                    this.playState = 'once';
                }else if(this.playState === 'once'){
                    this.playState = 'all';
                }
            },
            goToTime(e){
                //点击跳跃播放时间
                $(".audio")[0].currentTime = (e.offsetX / $('.duration').width()) * $('.audio')[0].duration;
            },
            changeMusic(index){
                //单曲切换
                if(this.audio.albumIndex == null){
                    this.$store.commit("CHANGEMUSIC",{
                        index:index,
                        playerbg:this.audio.album[index].playerbg,
                        albumImg:this.audio.album[index].singerImg
                    })
                }else if(typeof this.audio.albumIndex == 'number'){
                    //专辑切换
                    this.$store.commit("CHANGEMUSIC",{
                        index:index,
                        playerbg:this.audio.playerbg,
                        albumImg:this.audio.albumImg
                    })
                }
            },
            goNext(){
                if(this.playState === 'random'){
                    let index = ~~(Math.random() * this.audio.album.length);
                    this.changeMusic(index)
                }else{
                    if(this.audio.index >= this.audio.album.length - 1){
                        this.changeMusic(0);
                    }else{
                        this.changeMusic(this.audio.index + 1)
                    }
                }
            },
            goPrev(){
                if(this.playState === 'random'){
                    let index = ~~(Math.random() * this.audio.album.length);
                    this.changeMusic(index)
                }else{
                    if(this.audio.index <= 0){
                        this.changeMusic(this.audio.album.length - 1);
                    }else{
                        this.changeMusic(this.audio.index - 1)
                    }
                }
            },
            playList(index){
                //播放列表内的切换歌曲，调用函数传入当前的下标即可
                this.changeMusic(index)
            },
            hideLyric(){
                this.isShowLyric = false;
            },
            showLyric(){
                //显示歌词，同时获取歌词
                this.isShowLyric = true;
                //请求歌词
                this.$http.get(this.audio.album[this.audio.index].musicLyric).then(res=>{
                    this.lyric = this.parseLyric(res.data);
                })
            },
            //格式化歌词
            parseLyric(lyric){
                var arr = [];
                var lines = lyric.split(/\n/);
                var getLyricTime = /\[\d{2}:\d{2}\.\d{2}\]/g;
                //删除没有时间的歌词
                while(!getLyricTime.test(lines[0])){
                    lines = lines.splice(1);
                }
                //如果空行没有时间会出问题，所以删掉最后的空行
                if(lines[lines.length-1].length === 0){
                    lines.pop();
                }
                //遍历歌词数组，将歌词的时间，转换成秒数
                lines.forEach(item=>{
                    //得到时间和歌词的分界点
                    var index = item.indexOf("]");
                    //字符串方法截取，得到时间
                    var time = item.substr(1, index-1);
                    //得到歌词
                    var geci = item.substr(index+1);
                    //01:05.08将这样的时间转换成["01","05.08"]
                    var timerArr = time.split(":");
                    //最终得到总秒数
                    arr.push([timerArr[0] * 60 + parseFloat(timerArr[1]), geci])
                })
                console.log(arr)
                return arr;
            }
        },
        //监听换歌，切换歌词（重新请求歌词）
        watch:{
            playerIndex(){
                //请求歌词
                this.$http.get(this.audio.album[this.audio.index].musicLyric).then(res=>{
                    this.lyric = this.parseLyric(res.data);
                })
            },
            // '$store.state.audio.albumIndex'(){ //监听专辑变化
            //     this.$http.get(this.audio.album[this.audio.index].musicLyric).then(res=>{
            //         this.lyric = this.parseLyric(res.data);
            //     })
            // }
        }
     }
</script>
<style scoped lang='stylus' src="./audioPlayer.styl"></style>