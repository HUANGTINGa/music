import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import axios from 'axios'
import VueAxios from 'vue-axios';
import directives from './plugins/directives.js';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper);
Vue.use(Vuex);
Vue.use(VueAxios, axios)
Vue.use(directives); //注册全局指令

const store = new Vuex.Store({
    state:{
        mapList:[],
        player:{
            isShowAlbum:false,
            album:[],
            index:null,  //专辑的index
        },
        audio:{
            isShowAudio:false,
            album:[],       //当前专辑的数据
            index:null,     //第几首歌
            albumImg:null,   //专辑的图片，在热歌里面没有
            playerbg:null,   //播放器的背景图
            //专辑的下标
            //如果 == null 表示播放单曲
            //如果 == 0 表示第一张专辑
            //如果 == 1 表示第二张专辑
            albumIndex:null
        }
    },
    mutations:{
        GETALL(state,payload){
            state.mapList = payload.mapList;
        },
        ShowOrHideAlbum(state,payload){
            //控制点击显示专辑页面
            state.player.isShowAlbum = payload.isShowAlbum;
            //给专辑页面传入整张专辑的数据
            state.player.album = payload.album;
            //专辑的下标（第几个专辑）
            state.player.index = payload.index;
        },
        HideAlbum(state,payload){
            state.player.isShowAlbum = false;
        },
        ShowOrHidePlayer(state,payload){
            state.audio.isShowAudio = payload.isShowAudio;
        },
        SHOWPLAYER(state,payload){
            //显示播放器
            state.audio.isShowAudio = payload.isShowAudio;
            //播放器里面的列表，有可能是单曲 有可能是专辑
            state.audio.album = payload.album;
            //点击显示播放是，设置当前点击的是第几首歌
            state.audio.index = payload.index;
            //专辑或单曲作者的头像
            state.audio.albumImg = payload.albumImg;
            //播放器背景图
            state.audio.playerbg = payload.playerbg;
            //专辑的index
            //如果 == null 表示播放单曲
            //如果 == 0 表示第一张专辑
            //如果 == 1 表示第二张专辑
            state.audio.albumIndex = payload.albumIndex;
        },
        CHANGEMUSIC(state,payload){
            state.audio.index = payload.index;
            state.audio.albumImg = payload.albumImg;
            state.audio.playerbg = payload.playerbg;
        }
    },
    actions:{
        GETALL({commit,state}){
            //这里不能用this，因为this是store的实例，并不是vue的实例
            Vue.axios.get("../static/data.json").then((res) => {
                commit("GETALL", res.data)
            })
        }
    }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
