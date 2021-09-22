<template>
	<view class="container">
    <!-- 登录框 -->
    <!-- <image class="logo" src="../../static/cn-logp.png" mode="aspectFit"></image> -->
    <form class="login-wrap" @submit="login">
      <!-- {{'  '}}  占位符 -->
      <view class="title">登录{{'  '}}<text class="log_font">CHECKYYan</text></view>
      <!-- <view class="title sub-title"></view> -->
      <view class="input-wrap" :class="nameStatus ? 'name_satus' : ''">
        <uni-icons type="person" size="20" color="#bebebe"></uni-icons>
        <input type="text" name="username" placeholder="请输入用户名" placeholder-style="color: #bebebe;" confirm-type="next" v-model="username" @focus="loginFailed=false">
        <text style="color: #ff0303;" v-if="nameStatus">请输入账号！</text>
      </view>
      <view class="input-wrap" :class="pawStatus ? 'paws_satus' : ''">
        <uni-icons type="locked" size="20" color="#bebebe"></uni-icons>
        <input type="text" name="password" placeholder="请输入密码" placeholder-style="color: #bebebe;" :password="!showPw" confirm-type="next" v-model="pwd" @focus="loginFailed=false">
        <text style="color: #ff0303;" v-if="pawStatus">请输入密码！</text>
        <uni-icons :type="showPw ? 'eye-slash' : 'eye'" size="20" :color=" showPw ? '#242a31' : '#bebebe'" @click="switchPwState"></uni-icons>
      </view>
      <view class="msg-wrap" v-show="loginFailed">
        <view class="msg-text">
          <text>用户名或密码错误，请重试。</text>
          <text>如忘记密码，请联系管理员。</text>
        </view>
      </view>
      <checkbox-group class="input-wrap checkbox" @change="checkboxChange">
        <label>
          <checkbox color="#ffb40b" :checked="rememberPw" /><text>记住密码</text>
        </label>
      </checkbox-group>
      <button class="btn" type="primary" form-type="submit"><uni-icons type="arrowthinright" color="#ffffff" size="40"></uni-icons></button>
    </form>
    <!-- copyright -->
    <view class="copyright">
      All Copyright Reserved by CHECKYAN @ 2021.
    </view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue'
	export default {
		data() {
			return {
        username: '',
        pwd: '',
				showPw: false,
        rememberPw: false,
        loginFailed: false,
        nameStatus: false,
        pawStatus: false
			}
		},
    components: {
      uniIcons
    },
    methods: {
      // 初始化
      init () {
		  // 如果为 false 以 后面的 '' 空字符串 为结果,就直接 赋值空
        this.username = uni.getStorageSync('username') || ''
        this.pwd = uni.getStorageSync('pwd') || ''
        if (this.pwd) {
          this.rememberPw = true
        }
      },
      // 显示密码
      switchPwState () {
        this.showPw = !this.showPw
      },
      // 记住密码
      checkboxChange () {
        this.rememberPw = !this.rememberPw
      },
      // 登录
      async login () {
        if (!this.username) {
          this.nameStatus = true
          this.pawStatus = false
          return
        } else if (!this.pwd) {
          this.pawStatus = true
          this.nameStatus = false
          return
        } else {
          this.nameStatus = false
          this.pawStatus = false
        }
				// 设置缓存
        uni.setStorageSync('username', this.username)
        if (this.rememberPw) {
          uni.setStorageSync('pwd', this.pwd)
        } else {
          // 从本地缓存中同步移除指定 pwd
          uni.removeStorageSync('pwd')
        }
		
				// Loading 效果 提示加载文字
        uni.showLoading({
          title: '加载中'
        })
				uni.removeStorageSync('token')
        
				try {
					const tokenRes = await this.$api.Sign({
						userName: this.username,
            userPwd: this.pwd
					})
          // 获取到 登陆凭证 然后存到 缓存中
					uni.setStorageSync('token', tokenRes.token)
          uni.showToast({ title: '登录成功', duration: 2000 }) 
          // 登陆成功之后,直接跳到 导航页
					uni.switchTab({
						url: '../cockpit/cockpit'
					})
				} finally {
				}
			}
    },
    onReady () {
      this.init()
    }
	}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .logo {
    display: block;
    width: 500rpx;
    height: 300rpx;
    margin: 70rpx auto;
  }
  .login-wrap {
    width: 600rpx;
    padding-top: 15vh;
    background-color: #fff;
    border-radius: 6px;
    // box-shadow: 0 0 6px 0 #ccc;

    .log_font {
      font-size: 60rpx;
      font-weight: 600;
    }
    .title {
      font-size: 46rpx;
      text-align: center;
      height: 70rpx;
      line-height: 70rpx;
      margin: 0 auto;
    }
    .sub-title {
      width: 200rpx;
      font-size: 36rpx;
      border-bottom: 3px solid $uni-color-primary;
      margin-bottom: 80rpx
    }
    .input-wrap {
      height: 96rpx;
      line-height: 92rpx;
      margin: 52rpx 0;
      padding: 0 32rpx;
      display: flex;
      align-items: center;
      border: 1px solid #d2d0d0;
      border-radius: 13px;
      // background: #f4f4f4;
      input {
        margin-left: 20rpx;
        flex: 1;
      }
    }
    .name_satus {
      border: 1px solid #ff0303;
    }
    .paws_satus {
      border: 1px solid #ff0303;
    }
    .msg-wrap {
      height: 60rpx;
      font-size: 24rpx;
      color: $uni-color-error;
      .msg-text {
        margin-left: 25rpx;
        display: flex;
        flex-direction: column;
        text-align: center;
      }
    }
    .checkbox {
      border: none;
	  margin: 10rpx 0;
	  height: 60rpx;
    }
    .btn {
      background-color: #494949;
	  height: 90px;
	  width: 90px;
	  border-radius: 50px;
	  line-height: 90px;
	  margin-top: 40rpx;
	  font-size: 48rpx;
	  font-weight: 500;
    }
  }
  .copyright {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 12px;
    position: fixed;
    bottom: 0;
    color: #bebebe;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
