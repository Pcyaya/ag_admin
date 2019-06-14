<template>
  <div class="viewimg">
    <div class="dialogs">
      <div class="imgView">
        <el-dialog :visible.sync="dialogVisible">
          <div class="contents">
            <div class="contents-title">
              <span>{{imgData.index+1}}</span>/
              <span>{{imgData.list.length}}</span>
              <div class="rotating">
                <el-button type="text" @click="rotat">
                  <i class="el-icon-refresh"></i>
                </el-button>
              </div>
            </div>
            <div class="contents-img">
              <div class="prev curz" v-if="imgData.index>0">
                <i
                  @click="imgViewPre(imgData.list, imgData.index, imgData.url)"
                  class="el-icon-arrow-left"
                ></i>
              </div>
              <div v-else class="prev">
                <i class="el-icon-arrow-left"></i>
              </div>
              <div class="imgv">
                <img :src="imgViewUrl" alt>
              </div>
              <div class="nextv curz" v-if="imgData.index<imgData.list.length-1">
                <i
                  @click="imgViewNext(imgData.list, imgData.index, imgData.url)"
                  class="el-icon-arrow-right"
                ></i>
              </div>
              <div v-else class="nextv">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgData: this.imgurl,
      imgViewUrl: this.imgurl.url + this.imgurl.list[this.imgurl.index],
      dialogVisible: true,
      current: 0
    };
  },
  created() {
    // console.log(this.imgurl);
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.typeT();
        this.dialogVisible = true;
      }
    }
  },
  methods: {
    typeT() {
      this.$emit("typeBy", false);
    },
    imgViewPre(data, index, altUrl) {
      if (index == 0) {
        this.$message({
          message: "已经是第一张了！",
          type: "warning",
          center: true
        });
      } else {
        index--;
        this.imgViewUrl = altUrl + data[index];
        this.imgData.index = index;
      }
    },
    imgViewNext(data, index, altUrl) {
      if (index == data.length - 1) {
        this.$message({
          message: "已经是最后一张了！",
          type: "warning",
          center: true
        });
      } else {
        index++;
        this.imgViewUrl = altUrl + data[index];
        this.imgData.index = index;
      }
    },
    //旋转图片
    rotat() {
      this.current = (this.current + 90) % 360;
      $(".imgv img").css({ transform: "rotate(" + this.current + "deg)" });
    }
  },
  props: ["imgurl", "type"]
};
</script>

<style lang="less">
.viewimg {
  .dialogs {
    .imgView {
      .el-dialog {
        margin-top: 0 !important;
        width: 90%;
        height: 100%;
        overflow: auto;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.7);
      }
      .el-dialog__headerbtn {
        z-index: 1;
      }
      .el-icon-close {
        color: #fff;
        &:hover {
          opacity: 0.7;
        }
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
        margin: 0;
      }
      .contents {
        position: absolute;
        width: 100%;
        height: 100%;
        .contents-title {
          height: 8%;
          color: #fff;
          font-size: 18px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          > span {
            display: block;
            background: rgba(0, 0, 0, 0.5);
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 50%;
            text-align: center;
            margin: 0 7px;
          }
          .rotating {
            position: absolute;
            .el-button {
              margin-left: 230px;
            }
            i {
              font-size: 20px;
            }
          }
        }
        .contents-img {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 90%;
          .imgv {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            width: 100%;
            height: 100%;
            overflow: hidden;
            img {
              max-height: 100%;
              border-radius: 4px;
            }
          }
          .prev,
          .nextv {
            color: #999;
            font-size: 400%;
          }
          .curz {
            cursor: pointer;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
