module.exports = {
  "moduleData": {
    "id": 17679,
    "name": "hook",
    "cover": "https://img.alicdn.com/tfs/TB1mkjeqlr0gK0jSZFnXXbRRXXa-1404-1292.png",
  },
  "code": {
    "panelDisplay": [
      {
        "panelName": "index.vue",
        "panelValue": `
        <template>
        <div class="find-tutor-page">
          <img class="hd" :src="hd" /> <img class="zhanghao" :src="zhanghao" />
          <img class="circle" :src="circle" />
          <div class="bd">
            <div class="container">
              <img class="search" :src="search" />
              <span class="lookingForTeacher">{{ lookingForTeacher }}</span>
            </div>
          </div>
          <span class="submain">{{ submain }}</span>
          <div class="row">{{ 'hm-component=van-field' }}</div>
          <span class="row1">{{ row1 }}</span>
          <div class="row2">
            <div class="group">
              <span class="pleaseSelectGrade">{{ pleaseSelectGrade }}</span>
              <img class="sanjiaoxing" :src="sanjiaoxing" />
            </div>
          </div>
          <span class="row3">{{ row3 }}</span>
          <div class="row4">
            <div class="container_2">
              <span class="enterUniversity">{{ enterUniversity }}</span>
              <img class="sanjiaoxing_2" :src="sanjiaoxing_2" />
            </div>
          </div>
          <span class="row5">{{ row5 }}</span>
          <div class="row6">
            <div class="tagWrap_2">
              <span class="tag_2">{{ tag_2 }}</span>
            </div>
          </div>
          <div class="ft">
            <div class="group_2">
              <div class="outer">
                <img class="shopCreditLv0" :src="shopCreditLv0" />
                <img class="dot" :src="dot" />
              </div>
              <span class="homePage">{{ homePage }}</span>
            </div>
            <div class="container_3">
              <div class="lendWrap">
                <img class="lend" :src="lend" />
                <div class="welcomesvgiconWrap">
                  <img class="welcomesvgicon" :src="welcomesvgicon" />
                </div>
                <img class="welcomesvgicon_2" :src="welcomesvgicon_2" />
                <img class="picture" :src="picture" />
              </div>
              <span class="examination">{{ examination }}</span>
            </div>
            <div class="block">
              <div class="zhaopianWrap">
                <img class="zhaopian" :src="zhaopian" />
                <img class="dot_2" :src="dot_2" />
              </div>
              <span class="courses">{{ courses }}</span>
            </div>
            <div class="group_3">
              <img class="icHome" :src="icHome" />
              <div class="lidaiconCircleMinuWrap">
                <img class="Mefillgreen" :src="Mefillgreen" />
                <img class="lidaiconCircleMinu" :src="lidaiconCircleMinu" />
              </div>
              <span class="my">{{ my }}</span>
            </div>
          </div>
        </div>
      </template>
      <script>
      export default {
        data() {
          return {
            hd:
              './images/img_23095_0_11.png',
            zhanghao:
              './images/img_23095_0_12.png',
            circle:
              './images/img_23095_0_13.png',
            search:
              './images/img_23095_0_14.png',
            lookingForTeacher: '寻找老师',
            submain: '寻找老师',
            row1: '选择年级',
            pleaseSelectGrade: '请选择年级',
            sanjiaoxing:
              './images/img_23095_0_15.png',
            row3: '首选大学',
            enterUniversity: '进入大学',
            sanjiaoxing_2:
              './images/img_23095_0_15.png',
            row5: '位置区域',
            tag_2: '请选择位置',
            shopCreditLv0:
              './images/img_23095_0_9.png',
            dot:
              './images/img_23095_0_10.png',
            homePage: '首页',
            lend:
              './images/img_23095_0_0.png',
            welcomesvgicon:
              './images/img_23095_0_1.png',
            welcomesvgicon_2:
              './images/img_23095_0_2.png',
            picture:
              './images/img_23095_0_3.png',
            examination: '考试',
            zhaopian:
              './images/img_23095_0_4.png',
            dot_2:
              './images/img_23095_0_5.png',
            courses: '课程',
            icHome:
              './images/img_23095_0_6.png',
            Mefillgreen:
              './images/img_23095_0_7.png',
            lidaiconCircleMinu:
              './images/img_23095_0_8.png',
            my: '我的'
          };
        },
        methods: {}
      };
      </script>
      <style>
      @import './index.response.css';
      </style>      
        `,
        "panelType": "vue"
      },
      {
        "panelName": "style.js",
        "panelValue": "export default {\n  box: {\n    display: 'flex',\n    alignItems: 'flex-start',\n    flexDirection: 'column',\n    borderRadius: '3.20vw',\n    backgroundColor: '#ffffff',\n    width: '93.60vw',\n    height: '86.13vw'\n  },\n  bd: { width: '93.60vw', height: '52.53vw' },\n  main: {\n    marginTop: '4.00vw',\n    marginLeft: '3.20vw',\n    width: '42.67vw',\n    maxWidth: '88.80vw',\n    height: '4.80vw',\n    overflow: 'hidden',\n    textOverflow: 'ellipsis',\n    lineHeight: '4.80vw',\n    whiteSpace: 'nowrap',\n    color: '#333333',\n    fontSize: '4.27vw',\n    fontWeight: 500\n  },\n  submain: {\n    marginTop: '2.13vw',\n    marginLeft: '3.20vw',\n    width: '90.13vw',\n    height: '10.67vw',\n    overflow: 'hidden',\n    textOverflow: 'ellipsis',\n    lineHeight: '5.33vw',\n    color: '#888888',\n    fontSize: '3.47vw',\n    fontWeight: 300\n  },\n  ft: {\n    boxSizing: 'border-box',\n    display: 'flex',\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    marginTop: '3.20vw',\n    paddingRight: '3.07vw',\n    paddingLeft: '3.20vw',\n    width: '93.60vw'\n  },\n  outer: { display: 'flex', alignItems: 'center', flexDirection: 'row', height: '4.80vw' },\n  wrap: {\n    display: 'flex',\n    position: 'relative',\n    alignItems: 'flex-start',\n    flexDirection: 'row',\n    justifyContent: 'flex-end',\n    width: '4.80vw',\n    height: '4.80vw'\n  },\n  icon: { position: 'absolute', top: '0.00vw', left: '0.00vw', width: '4.80vw', height: '4.80vw', overflow: 'hidden' },\n  icon_2: { position: 'relative', marginTop: '2.93vw', width: '1.87vw', height: '1.87vw' },\n  beautifulClothesFashion: {\n    marginLeft: '0.80vw',\n    width: '12.80vw',\n    height: '3.73vw',\n    lineHeight: '3.73vw',\n    whiteSpace: 'nowrap',\n    color: '#666666',\n    fontSize: '3.20vw',\n    fontWeight: 300\n  },\n  tagWrap: {\n    boxSizing: 'border-box',\n    display: 'flex',\n    alignItems: 'flex-start',\n    flexDirection: 'row',\n    marginLeft: '0.80vw',\n    borderRadius: '0.80vw',\n    backgroundColor: 'rgba(253,234,238,0.90)',\n    paddingRight: '1.20vw',\n    paddingLeft: '1.07vw',\n    height: '3.73vw'\n  },\n  tag: {\n    marginTop: '0.27vw',\n    width: '10.67vw',\n    height: '3.20vw',\n    lineHeight: '3.20vw',\n    whiteSpace: 'nowrap',\n    color: '#ff2c54',\n    fontSize: '2.67vw',\n    fontWeight: 400\n  },\n  block: { display: 'flex', flexDirection: 'row' },\n  icon_3: { marginTop: '1.47vw', width: '3.47vw', height: '2.67vw' },\n  num: {\n    marginTop: '1.20vw',\n    marginLeft: '0.80vw',\n    width: '6.40vw',\n    height: '3.20vw',\n    lineHeight: '3.20vw',\n    whiteSpace: 'nowrap',\n    color: '#999999',\n    fontSize: '2.67vw',\n    fontWeight: 400\n  }\n};\n",
        "panelType": "js"
      }
    ],
    "noTemplate": true
  }
};
