<template>
  <div class="home">
    <div class="uploadBtn"
         @click.stop="newUpload">
      +
    </div>
    <input v-for="(item, index) in inputArr"
           class="hidden"
           :key="index"
           :ref="'input'+index"
           type="file"
           name=""
           id=""
           @change="inpchange">
    <div class="uploadingBox">
      <div class="uploading"
           v-for="(item, index) in upLoadData"
           :key="index">
        {{Math.floor((item.current-1)/item.total*100)}}%
        <button @click="stop(index)"
                v-if="item.current<=item.total"
                v-html="item.uploading?'暂停':'继续'"></button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data () {
    return {
      inputArr: [],
      upLoadSet: {
        minSize: 0,
        maxSize: 300,
        pieceSize: 1 / 128
      },
      upLoadData: []
    }
  },
  methods: {
    newUpload () {
      this.inputArr.push(1)
      console.log(111)
      this.$nextTick(() => {
        this.$refs['input' + (this.inputArr.length - 1)][0].click()
      })
    },
    inpchange (e) {
      const file = e.target.files[0]
      console.log(file)
      const minsize = this.upLoadSet.minSize || 0
      const maxsize = this.upLoadSet.maxSize || 300
      if (file.size < minsize * 1024 * 1024) {
        alert('文件过小')
        return
      }
      if (file.size > maxsize * 1024 * 1024) {
        alert('文件过大')
        return
      }
      const exist = this.upLoadData.some(item => {
        if (item.name === file.name) {
          return true
        }
      })
      if (exist) {
        alert('不能上传同一个文件')
        return
      }
      this.cut(file)
    },
    cut (file) {
      let upLoadData = {
        name: file.name,
        size: file.size,
        total: Math.ceil(file.size / (this.upLoadSet.pieceSize * 1024 * 1024)),
        current: 1,
        // 测试属性用于暂停
        uploading: true,
        pieces: []
      }
      for (let i = 0; i < upLoadData.total; i++) {
        let piece
        if (i < upLoadData.total - 1) {
          piece = file.slice(i * this.upLoadSet.pieceSize * 1024 * 1024, (i + 1) * this.upLoadSet.pieceSize * 1024 * 1024)
        } else {
          piece = file.slice(i * this.upLoadSet.pieceSize * 1024 * 1024, upLoadData.size)
        }
        upLoadData.pieces.push(piece)
      }
      this.upLoadData.push(upLoadData)
      console.log(this.upLoadData)
      this.send(this.upLoadData.length - 1)
    },
    send (index) {
      console.log(index)
      let formdata = new FormData()
      if (this.upLoadData[index].current > this.upLoadData[index].total) {
        return
      }
      if (!this.upLoadData[index].uploading) {
        return
      }
      formdata.append('name', this.upLoadData[index].name)
      formdata.append('size', this.upLoadData[index].size)
      formdata.append('total', this.upLoadData[index].total)
      formdata.append('current', this.upLoadData[index].current)
      formdata.append('data', this.upLoadData[index].pieces[this.upLoadData[index].current - 1])
      this.Api.video(formdata).then(res => {
        console.log(res)
        if (res.data) {
          this.upLoadData[index].current = res.data
          this.send(index)
        } else {
          alert(`第${index}个文件传输中断`)
        }
      })
    },
    stop (index) {
      this.upLoadData[index].uploading = !this.upLoadData[index].uploading
      if (this.upLoadData[index].uploading) {
        this.send(index)
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.home {
  .uploadBtn {
    width: 100px;
    height: 100px;
    font-size: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ccc;
    cursor: pointer;
  }
  .hidden {
    display: none;
  }
  .uploadingBox {
    display: flex;
    .uploading {
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
    }
  }
}
</style>
