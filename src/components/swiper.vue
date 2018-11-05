<template>
    <swiper :options="swiperOption">
        <!-- slides -->
        <swiper-slide v-for="item in swiperArr" :key="item.imgSrc">
            <img :src="item.imgSrc">
        </swiper-slide>

        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>
<script>
export default {
    props:["swiperArr"],
    data() {
        return {
            swiperOption: {
                //轮播图小圆点
                pagination: {
                    el: '.swiper-pagination'
                }
            }
        }
    }
}
</script>
<style scoped>
    img{width: 100%;display: block;}
</style>