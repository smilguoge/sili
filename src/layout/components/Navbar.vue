<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <search id="header-search" class="right-menu-item" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="right-btns right-menu-item">
          <el-button size="small" round @click="lockScreen()">
            <i class="el-icon-lock" />锁屏
          </el-button>
          <el-button size="small" round @click="lockScreen()">
            <i class="el-icon-bell" />考勤确认
          </el-button>
          <el-button size="small" round @click="Moneytrue()">
            <i class="el-icon-refresh-left" />款项交接
          </el-button>
          <!-- 子组件 -->
          <!-- eslint-disable-next-line vue/attribute-hyphenation -->
          <Money :SnycsMoney.sync="MoneyVisible" @cancel="Moneyfalse" />
        </div>

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <lang-select class="right-menu-item hover-effect" /> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>-->
          <el-dropdown-item disabled>
            <div style="text-align:center;">
              <span>{{ '张三' }}</span>
            </div>
            <div style="text-align:center;">
              <span>{{ 'XXX分店' }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;text-align:center;" @click="lockScreen">{{ '修改密码' }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;text-align:center;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div id="time-bar">
      <i class="iconfont icon-riqi" />
      <span>{{ systemTime }}</span>
    </div>
  </div>
</template>

<script>
// 子组件
import Money from '@/layout/components/Money'
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { Moneycheck_up } from '@/api/home.js'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    // LangSelect,
    Search,
    Money
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    setInterval(() => {
      const time = new Date()
      const year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      let hours = time.getHours()
      let minute = time.getMinutes()
      let second = time.getSeconds()
      let week = time.getDay()

      if (month < 10) { month = '0' + month }
      if (date < 10) { date = '0' + date }
      if (hours < 10) { hours = '0' + hours }
      if (minute < 10) { minute = '0' + minute }
      if (second < 10) { second = '0' + second }

      switch (week) {
        case 0:
          week = '日'
          break
        case 1:
          week = '一'
          break
        case 2:
          week = '二'
          break
        case 3:
          week = '三'
          break
        case 4:
          week = '四'
          break
        case 5:
          week = '五'
          break
        case 6:
          week = '六'
          break
      }
      this.systemTime = `${year}年${month}月${date}日  星期${week}  ${hours}:${minute}:${second}`
    }, 1000)
    return {
      //  子组件控制
      MoneyVisible: false,
      systemTime: 'Loading...'
    }
  },
  created() {
    this.MoneyInspectpost()
    // // this.$store.commit("home/MONEYSET_UP", true);
    // console.log(this.$store.state);
    // this.$store.dispatch("home/mnoeySet_up", true);
    // console.log(this.$store.state.home.mnoeySet_up);
  },
  methods: {
    MoneyInspectpost() {
      const data = this.$store.state.home.mnoeySet_up
      if (data == true) {
        Moneycheck_up().then(res => {
          if (res.code == 200) {
            if (res.data.has_un_finish == true) {
              this.MoneyVisible = true
            }
          }
        })
        this.$store.dispatch('home/mnoeySet_up', false)
      }
    },
    Moneytrue() {
      this.MoneyVisible = true
    },
    Moneyfalse() {
      this.MoneyVisible = false
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    lockScreen() {
      //
      this.$message.info('功能开发中...')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #895dfe;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 55px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  #time-bar {
    float: right;
    height: 60px;
    width: 310px;
    line-height: 60px;
    font-size: 15px;
    color: #fff;
    text-align: center;
    i {
      margin-right: 4px;
    }
  }

  #header-search {
    float: left;
    height: 36px;
    margin-top: 12px;
    margin-left: 20px;
    color: #bbb;
    background-color: #f3efff;
    padding: 0 15px;
    border-radius: 32px;
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-btns i {
    margin-right: 5px;
    font-size: 14px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 12px;
        height: 48px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
