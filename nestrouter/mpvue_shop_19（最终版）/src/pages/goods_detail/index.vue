<template>
  <view>
    <!-- 1.0 轮播图 -->
    <swiper :indicator-dots="true" autoplay :interval="3000" :duration="1000" circular indicator-color="rgba(255,255,255,.5)" indicator-active-color="#ffffff">
      <block v-for="item in goods_detail.pics" :key="item.pics_id">
        <swiper-item>
          <image :src="item.pics_big" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 2.0 商品详情 -->
    <view class="product-info">
      <view class="product-head">
        <text class="price">￥{{goods_detail.goods_price}}</text>
      </view>
      <view class="product-body">
        <view class="product-name">{{goods_detail.goods_name}}</view>
        <view class="product-like">
          <view class="iconfont icon-shoucang"></view>
          <view>收藏</view>
        </view>
      </view>
      <view class="product-foot">
        <text>快递：免运费</text>
      </view>
    </view>
    <!-- 3.0 促销信息 -->
    <view class="part">
      <view class="part-item part-line">
        <text class="note">促销
        </text>
        <text class="color-main description">满300减30元
        </text>
      </view>
      <view class="part-item">
        <text class="note">已选
        </text>
        <text class="description">黑色/S/1件
        </text>
      </view>
    </view>
    <!-- 4.0 收货地址 -->
    <view class="part">
      <view class="part-item">
        <text class="note">送至</text>
        <view @click="chooseAddress">
          <block v-if="addressInfo">
            <text>{{addressInfo}}</text>
          </block>
          <block v-else>
            <text>请选择收获地址</text>
          </block>
        </view>
        <view class="iconfont icon-jiantouyou"></view>
      </view>
    </view>
    <!-- 5.0 图文详情 & 规格参数 -->
    <view class="tabs">
      <view class="tabs-head">
        <block v-for="(item,index) in tabs" :key="index">
          <view @click="tabSwitch(index)" :class="['tabs-item',selectedTabIndex===index ? 'active' : '']">{{item}}</view>
        </block>
      </view>
      <view class="tabs-body">
        <view v-show="selectedTabIndex===0">
          <view v-html="goods_detail.goods_introduce"></view>
        </view>
        <view v-show="selectedTabIndex===1">
          <view v-for="(item,index) in goods_detail.attrs" :key="item.attr_id" class="param-item">
            <text :class="['note',index === goods_detail.attrs.length-1?'param-item-last':'']">{{item.attr_name}}</text>
            <text :class="['description',index === goods_detail.attrs.length-1?'param-item-last':'']">{{item.attr_value}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 6.0 底部菜单条 -->
    <view class="fixed-bar">
      <view class="item">
        <button class="contact-btn" open-type="contact"></button>
        <view class="iconfont icon-kefu"></view>
        <text class="note">联系客服</text>
      </view>
      <view @click="goToShopCart" class="item">
        <view class="iconfont icon-gouwuche"></view>
        <text class="note">购物车</text>
      </view>
      <view class="btn-group">
        <view @click="addToShopCart" class="btn yellow-btn">加入购物车</view>
        <view class="btn red-btn">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script>
import { addLocalGoods } from '@/utils/goodsStorageTool.js'
export default {
  data() {
    return {
      goods_detail: {}, //商品数据
      addressInfo: null, //地址信息
      tabs: ['图文介绍', '规格参数'], //tabs
      selectedTabIndex: 0, //默认选中的tabs的索引
      goods_id: -1 //goods_id
    }
  },
  onLoad(options) {
    // 保存goods_id
    this.goods_id = options.goods_id

    // 根据id获取商品数据
    this.getGoodsData(options.goods_id)

    // 获取本地保存的地址信息，如果有就显示，如果没有就显示请选择收获地址
    const address = wx.getStorageSync('address')
    if (address) {
      this.addressInfo = `${address.provinceName} ${address.cityName} ${
        address.countyName
      }`
    }
  },
  methods: {
    async getGoodsData(goods_id) {
      const result = await this.$axios.get(
        `api/public/v1/goods/detail?goods_id=${goods_id}`
      )

      this.goods_detail = result.data.message
    },
    //选择收获地址
    chooseAddress() {
      wx.chooseAddress({
        success: res => {
          // 更新 送至 后面的内容
          this.addressInfo = `${res.provinceName} ${res.cityName} ${
            res.countyName
          }`

          // 把详细地址也存储起来
          res.detailAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo

          // 存储到小程序本地
          wx.setStorageSync('address', res)
        },
        fail: err => {
          //如果用户拒绝了，在这里是没法再次弹出授权窗口的
          wx.showModal({
            title: '提示', //提示的标题,
            content: '你需要去我的 > 设置里面开启授权，获取地址信息', //提示的内容,
            showCancel: false, //是否显示取消按钮,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F' //确定按钮的文字颜色
          })
        }
      })
    },
    //进行tab的切换
    tabSwitch(index) {
      this.selectedTabIndex = index
    },
    //加入购物车
    addToShopCart() {
      wx.showToast({
        title: '添加成功',
        image: '/static/img/duigou.png',
        duration: 2000
      })

      const goods = {
        goods_id: this.goods_id,
        goods_number: 1
      }

      addLocalGoods(goods)
    },
    //跳转到购物车页面
    goToShopCart(){
      wx.switchTab({ url: '/pages/shopcart/main' });
    }
  }
}
</script>

<style lang="less" scoped>
swiper {
  width: 750rpx;
  height: 720rpx;
}

swiper image {
  width: 100%;
  height: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  height: 300rpx;
  background-color: #fff;
  padding: 0 16rpx;
}

.product-head {
  height: 38rpx;
  padding: 40rpx 0;
}

.product-head .price {
  color: #ff2d4a;
  font-size: 50rpx;
  // margin-left: 10rpx;
}

.product-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-body .product-name {
  font-size: 34rpx;
  width: 546rpx;
  height: 88rpx;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-body .product-like {
  width: 50rpx;
  height: 78rpx;
  border-left: 1rpx solid #ddd;
  padding-left: 46rpx;
  margin-right: 30rpx;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.product-foot {
  font-size: 30rpx;
  color: #999;
  margin-top: 34rpx;
}

.part {
  background-color: #fff;
  margin: 20rpx 0;
  font-size: 32rpx;
  color: #999;
  &-line:after {
    content: '';
    height: 1rpx;
    width: 734rpx;
    background-color: #ddd;
    display: block;
    position: absolute;
    bottom: -1rpx;
  }
  &-item {
    display: flex;
    padding: 28rpx 16rpx;
    position: relative;
    align-items: center;
    // justify-content: space-between;
  }
}
.part .note {
  color: #333;
  margin-right: 40rpx;
}

.part .description {
  width: 490rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.part .color-main {
  color: #ff2d4a;
}
.tabs {
  &-head {
    height: 100rpx;
    background-color: #fff;
    display: flex;
    .active {
      color: #ff2d4a;
      font-weight: 400;
      &:after {
        content: '';
        height: 12rpx;
        width: 100%;
        background-color: #ff2d4a;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
  &-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: relative;
  }
  &-body {
    background-color: #fff;
    padding: 16rpx;
    margin-bottom: 100rpx;
  }
}
.param-item {
  display: flex;
  height: 100rpx;
  line-height: 100rpx;
  border-top: 1px solid rgba(92, 92, 92, 0.3);
  border-right: 1px solid rgba(92, 92, 92, 0.3);
  border-left: 1px solid rgba(92, 92, 92, 0.3);
}
.param-item .note {
  padding-left: 30rpx;
  width: 300rpx;
  border-right: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item-last {
  border-bottom: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item .description {
  padding-left: 30rpx;
  width: 400rpx;
}

.fixed-bar {
  width: 750rpx;
  height: 98rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
  .btn {
    width: 213rpx;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
  }
  .yellow-btn {
    background-color: #ffb400;
  }
  .red-btn {
    background-color: #ff2d4a;
  }
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .contact-btn {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .iconfont {
      width: 40rpx;
      height: 40rpx;
      font-size: 40rpx;
    }
    .note {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #666;
    }
  }
}
.iconfont .icon-shoucang {
  font-size: 50px;
  color: '#ff2d4a' !important;
}

.iconfont .icon-shoucang-fill {
  font-size: 50px;
  color: '#ff2d4a' !important;
}
</style>

