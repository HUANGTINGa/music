<template>
    <div class="indexmusic" v-height="50" >
        <swiper :swiperArr="swiperArr"></swiper>
        <div class="album">
            <h3>推荐专辑</h3>
            <ul>
                <li v-for="(item,index) in album" @click="showAlbum(item,index)">
                    <img :src="item.albumImg">
                    <p>{{item.albumTitle}}</p>
                </li>
            </ul>
        </div>
        <div class="recommend">
            <h3>热歌列表</h3>
            <ul>
                <li v-for="(item,index) in recommend" @click="playRecommend(recommend,index)"
                    :class="{cur:index == $store.state.audio.index && $store.state.audio.albumIndex == null}"
                >
                    <span class="index">{{index + 1}}</span>
                    <div>
                        <p>{{item.musicName}}</p>
                        <p>{{item.musicSinger}}</p>
                    </div>
                    <span class="iconfont icon-laba"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import swiper from "../../components/swiper.vue";
    export default {
        data(){
            return {
                //轮播图数据
                swiperArr:[
                    {imgSrc:'http://p1.music.126.net/38Ri5m8AuSqwY_3sNyQCKQ==/109951163647643007.jpg'},
                    {imgSrc:'http://p1.music.126.net/1j7JC9ijByhF_2jr8Q6lKg==/109951163598837461.jpg'},
                    {imgSrc:'http://p1.music.126.net/L9_Y6ZJYS-LiazUBvIG0oQ==/109951163601422085.jpg'},
                    {imgSrc:'http://p1.music.126.net/dk2ppBJ34GKo43yVlwsqVg==/109951163602543559.jpg'},
                ]
            }
        },
        components:{
            swiper
        },
        created(){
            this.$store.dispatch("GETALL"); //请求data.json的数据
        },
        computed:{
            album(){
                //得到专辑数据列表
                return this.$store.state.mapList.album;
            },
            recommend(){
                //得到单曲数据列表
                return this.$store.state.mapList.recommend
            }
        },
        methods:{
            showAlbum(item,index){
                //点击进入传递当前专辑的数据：item是整张专辑数据，index是第几个专辑
                this.$store.commit("ShowOrHideAlbum", {
                    isShowAlbum:true,
                    album:item,
                    index:index
                })
            },
            playRecommend(recommend,index){
                //点击recommend是所有单曲列表和index是当前第几首歌
                this.$store.commit("SHOWPLAYER",{
                    isShowAudio:true, //显示播放器
                    album:recommend,  //所有单曲的歌列表
                    index:index,     //第几首歌
                    albumImg:recommend[index].singerImg,  //作者头像
                    playerbg:recommend[index].playerbg,   //播放器的背景图
                    albumIndex:null  //将专辑的下标设为null 表示单曲
                })
            }
        }
    }
</script>
<style scoped lang='stylus'>
    .indexmusic{
        overflow-y:scroll;background:#999;
        .album h3,.recommend h3{font-weight:normal;font-size:18px;height: 40px;line-height: 40px;}
        .album h3:before,.recommend h3:before{
            content:"|";color:#c20c0c;font-size:15px;background:#c20c0c;margin:0 6px;
        }
        .album{
            ul{
                overflow: hidden;
                li{
                    float: left;width: 33.333%;text-align:center;
                    img{width:100%;padding:2%;display: block;}
                }
            }
        }
        .recommend{
            ul{
                li{
                    overflow: hidden;padding-top:5px;
                    .index{
                        width: 50px;height: 50px;line-height: 50px;
                        text-align:center;float: left;
                    }
                    div{ float: left;
                        p{height: 25px;line-height: 25px;}
                        p:nth-child(1){font-size:16px;color:#3b3c3d;}
                        p:nth-child(2){font-size:14px;color:#888;}
                    }
                    .icon-laba{
                        height: 50px;width: 50px;line-height: 50px;
                        float: right;text-align:center;font-size:26px;
                    }
                }
                li.cur{
                    color:red;
                    div p {color:red;}
                }
            }
        }
    }
</style>
