<template>
  <view class="">
		<view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-line">开始时间：</view>
        <view class="uni-list-cell-db">
          <picker mode="date" fields="day" @change="startDateChange" :value="startDate">
          	<view>{{startDate}}</view>
          </picker>
        </view>
      </view>
      <view class="uni-list-cell">
        <view class="uni-list-line">结束时间：</view>
        <view class="uni-list-cell-db">
          <picker mode="date" fields="day" @change="endDateChange" :value="endDate">
          	<view>{{endDate}}</view>
          </picker>
        </view>
      </view>
    </view>
		<view class="">
			<view class="">
				<!-- https://demo.ucharts.cn/#/ -->
				<qiun-data-charts
					type="line"
					:ontouch="true"
					:opts="rawMaterialConsumptionOpts"
					:chartData="chartData"
					background="none"
				/>
			</view>
		</view>
  </view>
</template>

<script>
import moment from 'moment'
export default {
	data () {
		this.rawMaterialConsumptionOpts = {
      enableScroll: true,
      xAxis: {
        itemCount: 7, // 柱子间隙密度
        labelCount: 2 // x轴刻度间隙密度
      },
      yAxis: {
        showTitle: true,
        data: [
          {
            type: "right",
            position: "left",
            disabled: false,
            axisLine: true,
            axisLineColor: "#CCCCCC",
            calibration: false,
            fontColor: "#666666",
            fontSize: 13,
            textAlign: "right",
            title: "次",
            titleFontSize: 13,
            titleOffsetY: 0,
            titleOffsetX: 0,
            titleFontColor: "#666666"
          }
        ]
      },
      extra: {
        column: {
          type: "group",
          width: 20,
          categoryGap: 1,
          barBorderCircle: true,
          linearType: "custom",
          linearOpacity: 1,
          colorStop: 0,
          customColor: ["#6be6c1", "#3fb1e3"]
        }
      }
    }
		return {
			startDate: '',
			endDate: '',
			chartData:{
				categories:[],
				series:[
					{
						name: "访问量",
						data: []
					}
				],
			},
		}
	},
	created() {
		this.startDate = moment().startOf('month').format('yyyy-MM-DD')
    this.endDate = moment().format('yyyy-MM-DD')
		this.getPrecessParam()
	},
  methods: {
		startDateChange (event) {
			this.startDate = event.detail.value
			this.getPrecessParam()
		},
		endDateChange (event) {
			this.endDate = event.detail.value
			this.getPrecessParam()
		},
		async getPrecessParam () {
			// 实时数据
      uni.showLoading({
        title: '加载中'
      })
			const data = await this.$api.getUserValue({startingTime: this.startDate, endTime: this.endDate}).finally(_ => {
        uni.hideLoading()
      })
			this.chartData.categories = data.dataList.map(item => item.date)
			this.chartData.series[0].data = data.dataList.map(item => item.value)
		},
  }
}
</script>

<style lang="scss">

// 图太大 整成拖拽
.bar-wrap {
  width: 750rpx;
  overflow-x: scroll;
  overflow-y: hidden;
}
.bar-chart {
  width: 1000rpx;
}

.uni-list {
	.uni-list-cell {
		position: relative;
		border-bottom: 1px solid #ccc;
    height: 90rpx;
    line-height: 90rpx;
		.uni-list-cell-db {
			text-align: center;
		}
		.uni-list-line {
			position: absolute;
			left: 40rpx;
			top: 2rpx;
			z-index: 10;
		}
	}
	.uni-list-cell::after {
		background: none;
	}
}
</style>
