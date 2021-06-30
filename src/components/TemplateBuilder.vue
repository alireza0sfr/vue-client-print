<template>
  <div id="page" :dir="settings.pageDirections">
    <!--Buttons-->
    <i @click="convert2Image()" id="myBtn-final" type="button" class="fas fa-2x fa-eye"></i>
    <i
      v-if="locals.settingsModalShow == false"
      @click="settingsInitFunc()"
      class="fas fa-2x fa-cog"
    ></i>
    <i v-if="locals.settingsModalShow" @click="export2Json()" class="fas fa-2x fa-check-circle"></i>
    <!-- Main Wrapper and Sections-->

    <div class="wrapper">
      <!-- Section 1 (Template Builder) -->
      <div
        v-if="locals.settingsModalShow"
        :style="{'height': locals.defaultHeightOfPaper + 'in'}"
        class="template-builder container-fluid"
      >
        <div class="row flex-nowrap">
          <div
            :style="{'height': locals.defaultHeightOfPaper + 'in',
        'overflow': 'hidden',
        'width': '27%',
        'padding':'0px',
        'overflow-y': 'scroll',
        'border-left': '1px ridge black'}"
            class="col-auto col-md-3 col-xl-2 bg-white shadow"
          >
            <div class="text-decoration-none mb-3 toolbar header">
              <span class="fs-5">تنظیمات پرینت</span>
            </div>
            <div
              style="color: black;"
              class="d-flex flex-column text-align-start justify-content-start min-vh-100"
            >
              <ul class="nav nav-pills flex-column align-items-start" id="printConfigsMenu">
                <li style="width:100%" class="d-flex">
                  <label style="width: 40%;" class="p-2" for="pageSizeControl">نوع صفحه</label>
                  <div style="width:10%"></div>
                  <select
                    style="height:25%; width:50%; margin-left: 8px"
                    class="flex-grow-2 form-control mb-3"
                    v-model="settings.pageSize"
                    @change="calculateSizes()"
                    id="pageSizeControl"
                  >
                    <option>a3</option>
                    <option>a4</option>
                    <option>a5</option>
                  </select>
                </li>
                <li style="width:100%" class="d-flex">
                  <label style="width: 40%;" class="p-2" for="pageOrientiationsControl">حالت صفحه</label>
                  <div style="width:10%"></div>
                  <select
                    @change="calculateSizes()"
                    style="height:25%; width:50%; margin-left: 8px"
                    class="flex-grow-2 form-control mb-3"
                    v-model="settings.orientation"
                    id="pageOrientiationsControl"
                  >
                    <option>portrait</option>
                    <option>landscape</option>
                  </select>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 38%;" class="p-2">اسم فایل</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      style="height: 80%; margin-left: 2px"
                      v-model="settings.fileName"
                      class="flex-grow-2 form-control mb-3"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <label
                    style="width: 40%;"
                    class="form-check-label p-2"
                    for="repeatableHeaderControl"
                  >تکرار هدر</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="settings.isHeaderRepeatable"
                      id="repeatableHeaderControl"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <label
                    style="width: 40%;"
                    class="form-check-label p-2"
                    for="repeatableFooterControl"
                  >تکرار فوتر</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="settings.isFooterRepeatable"
                      id="repeatableFooterControl"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 40%;" class="d-none d-sm-inline p-2">جهت صفحه</span>
                  <div style="width:22%" class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="pageDirections"
                      id="pageDirections"
                      value="rtl"
                      v-model="settings.pageDirections"
                    />
                    <label class="form-check-label" for="pageDirections">راست</label>
                  </div>
                  <div style="width:22%; margin-right:10px" class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="pageDirections"
                      id="pageDirections2"
                      value="ltr"
                      v-model="settings.pageDirections"
                    />
                    <label class="form-check-label" for="pageDirections2">چپ</label>
                  </div>
                </li>
              </ul>
              <div class="text-decoration-none mb-3 toolbar header">
                <span class="fs-5">المنت ها</span>
              </div>
              <ul class="nav nav-pills d-flex flex-row" id="elementsMenu">
                <li style="width:50%; margin: 10px 0;">
                  <span
                    draggable="true"
                    @dragstart="startDraggingElement('textelement')"
                    @dragend="finishedDraggingElement()"
                    class="d-none d-sm-inline"
                  >
                    <img src="./elements/images/text.png" />
                    <div class="element-title">متن</div>
                  </span>
                </li>
                <li style="width:50%; margin: 10px 0;">
                  <span
                    class="d-none d-sm-inline"
                    draggable="true"
                    @dragstart="startDraggingElement('datetime')"
                    @dragend="finishedDraggingElement()"
                  >
                    <img src="./elements/images/timetable.png" />
                    <div class="element-title">تاریخ و ساعت</div>
                  </span>
                </li>
                <li style="width:50%; margin: 10px 0;">
                  <span
                    class="d-none d-sm-inline"
                    draggable="true"
                    @dragstart="startDraggingElement('pagecounter')"
                    @dragend="finishedDraggingElement()"
                  >
                    <img src="./elements/images/pages.png" />
                    <div class="element-title">شماره صفحه</div>
                  </span>
                </li>
                <li style="width:50%; margin: 10px 0;">
                  <span
                    class="d-none d-sm-inline"
                    draggable="true"
                    @dragstart="startDraggingElement('imageelement')"
                    @dragend="finishedDraggingElement()"
                  >
                    <img src="./elements/images/image.png" />
                    <div class="element-title">عکس</div>
                  </span>
                </li>
                <li style="width:50%; margin: 10px 0;">
                  <span
                    draggable="true"
                    @dragstart="startDraggingElement('bindingobjects')"
                    @dragend="finishedDraggingElement()"
                    class="d-none d-sm-inline"
                  >
                    <img src="./elements/images/binding.png" />
                    <div class="element-title">اتصال داده</div>
                  </span>
                </li>
              </ul>
              <div class="text-decoration-none mb-3 toolbar header">
                <span class="fs-5">تنظیمات المنت ها</span>
              </div>
              <ul
                class="nav nav-pills flex-column align-items-start align-items-sm-start"
                id="elementConfigsMenu"
              >
                <li
                  v-if="locals.selectedElement.type == 'textelement'"
                  style="width:100%"
                  class="d-flex"
                >
                  <span style="width: 38%;" class="p-2">متن</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      style="height: 80%; margin-left: 2px"
                      v-model="locals.selectedElement.options.configs.text"
                      class="flex-grow-2 form-control mb-3"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <label style="width: 40%;" class="form-check-label p-2" for="hasDateControl">تاریخ</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.hasDate"
                      id="hasDateControl"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <label style="width: 40%;" class="form-check-label p-2" for="hasTimeControl">ساعت</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.hasTime"
                      id="hasTimeControl"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'datetime'"
                >
                  <label
                    style="width: 40%;"
                    class="form-check-label p-2"
                    for="persiaDateControl"
                  >تاریخ شمسی</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.persianDate"
                      id="persiaDateControl"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'pagecounter'"
                >
                  <label
                    style="width: 40%;"
                    class="form-check-label p-2"
                    for="persianNumbersControl"
                  >اعداد فارسی</label>
                  <div style="width:20%" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="locals.selectedElement.options.configs.persianNumbers"
                      id="persianNumbersControl"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <label style="width: 38%;" class="p-2" for="imageFileControl">فایل تصویر</label>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="file"
                      @change="onFileChange()"
                      style="margin-left: 2px"
                      class="flex-grow-2 form-control mb-3"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                      id="imageFileControl"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <span style="width: 40%;" class="p-2">طول</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      class="flex-grow-2 form-control mb-3"
                      style="height: 80%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.height"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'imageelement'"
                >
                  <span style="width: 40%;" class="p-2">عرض</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      class="flex-grow-2 form-control mb-3"
                      style="height: 80%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.width"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li
                  style="width:100%"
                  class="d-flex"
                  v-if="locals.selectedElement.type == 'bindingobjects'"
                >
                  <label style="width: 40%;" class="p-2" for="bindingObjectsControl">نوع داده</label>
                  <div style="width:10%"></div>
                  <select
                    style="height:25%; width:50%; margin-left: 8px"
                    class="flex-grow-2 form-control mb-3"
                    v-model="locals.selectedElement.options.configs.field"
                    id="bindingObjectsControl"
                  >
                    <option
                      v-for="option in Object.keys(locals.selectedElement.options.configs.bindingObjects)"
                      :key="option"
                    >{{option}}</option>
                  </select>
                </li>
              </ul>
              <div class="text-decoration-none mb-3 toolbar header">
                <span class="fs-5">استایل المنت ها</span>
              </div>
              <ul
                class="nav nav-pills flex-column align-items-center align-items-sm-start"
                id="elementStylesMenu"
              >
                <li style="width:100%" class="d-flex">
                  <label style="width: 43%;" class="p-2" for="elementTextAlignControl">مکان نوشته</label>
                  <div style="width:10%"></div>
                  <select
                    v-model="locals.selectedElement.options.styles.textAlign"
                    style="height:25%; width:50%; margin-left: 8px"
                    class="flex-grow-2 form-control mb-3"
                    id="elementTextAlignControl"
                  >
                    <option>right</option>
                    <option>center</option>
                    <option>left</option>
                  </select>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 40%;" class="p-2">رنگ نوشته</span>
                  <div style="width:10%"></div>
                  <div style="width:50%" class="input-group input-group-sm">
                    <input
                      type="color"
                      class="flex-grow-2 form-control mb-3"
                      style="height: 80%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.color"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 40%;" class="p-2">اندازه فونت</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      class="flex-grow-2 form-control mb-3"
                      style="height: 80%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.fontSize"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 40%;" class="p-2">حاشیه</span>
                  <div style="width:10%"></div>
                  <div style="width:50%;" class="input-group input-group-sm">
                    <input
                      type="text"
                      class="flex-grow-2 form-control mb-3"
                      style="height: 80%; margin-left: 8px"
                      v-model="locals.selectedElement.options.styles.border"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                </li>
                <li style="width:100%" class="d-flex">
                  <span style="width: 40%;" class="d-none d-sm-inline p-2">مکان نوشته</span>
                  <div style="width:22%" class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="elementDirections"
                      id="elementDirections"
                      value="rtl"
                      v-model="locals.selectedElement.options.styles.direction"
                    />
                    <label class="form-check-label" for="elementDirections">راست</label>
                  </div>
                  <div style="width:22%; margin-right:10px" class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="elementDirections"
                      id="elementDirections2"
                      value="ltr"
                      v-model="locals.selectedElement.options.styles.direction"
                    />
                    <label class="form-check-label" for="elementDirections2">چپ</label>
                  </div>
                </li>
              </ul>
              <hr />
            </div>
          </div>

          <!-- Section 2 (Template)-->

          <div>
            <div
              v-if="locals.settingsModalShow"
              :style="{'height': locals.defaultHeightOfPaper + 'in', 'width': locals.defaultWidthOfPaper + 'in',
            'background-color': '#F1F5F8'}"
              class="template"
              @click="deSelectAll"
            >
              <div
                :style="{'height': locals.pageHeaderSize + 'in',
              'min-height': '0.6in'}"
                id="headerTemplate"
                class="section header"
                ref="headerTemplate"
                @drop="droppedElementOnHeader()"
                @dragenter.prevent
                @dragover.prevent
              >
                <component
                  v-for="element in elements.headerElements"
                  :key="element"
                  :is="element.type"
                  :options="element.options"
                  @click="element2ToolbarBind(element)"
                  @clickedOnElement="clickedOnElement()"
                />
              </div>
              <div id="bodyTemplate">
                <div>Body</div>
              </div>
              <div
                :style="{'height': locals.pageFooterSize + 'in',
              'min-height': '0.6in'}"
                id="footerTemplate"
                class="section footer"
                ref="footerTemplate"
                @drop="droppedElementOnFooter()"
                @dragenter.prevent
                @dragover.prevent
              >
                <component
                  v-for="element in elements.footerElements"
                  :key="element"
                  :is="element.type"
                  :options="element.options"
                  @click="element2ToolbarBind(element)"
                  @clickedOnElement="clickedOnElement()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextElement from "./elements/TextElement.vue";
import DateTime from "./elements/DateTime.vue";
import BindingObjects from "./elements/BindingObjects.vue";
import PageCounter from "./elements/PageCounter.vue";
import ImageElement from "./elements/ImageElement.vue";
export default {
  name: "TemplateBuilder",
  props: {
    options: Object,
  },
  components: {
    textelement: TextElement,
    datetime: DateTime,
    pagecounter: PageCounter,
    imageelement: ImageElement,
    bindingobjects: BindingObjects,
  },
  data() {
    return {
      locals: {
        pageSizeDictionary: {
          landscape: {
            a3: {
              width: 16.5,
              height: 11.7,
            },
            a4: {
              width: 11.7,
              height: 8.26,
            },
            a5: {
              width: 8.3,
              height: 5.8,
            },
          },
          portrait: {
            a3: {
              width: 11.7,
              height: 16.5,
            },
            a4: {
              width: 8.26,
              height: 11.7,
            },
            a5: {
              width: 5.8,
              height: 8.3,
            },
          },
        },
        settingsModalShow: false,
        isClicked: false,
        classType: "",
        selectedElement: {
          type: {},
          options: {
            id: 0,
            configs: {},
            styles: {},
          },
        },
      },
      settings: {
        pageHeaderSize: 0,
        pageFooterSize: 0,
        fileName: "nikan",
        isFooterRepeatable: true,
        isHeaderRepeatable: true,
        orientation: "portrait",
        pageSize: "a4",
        pageDirections: "rtl",
        headerElements: [],
        footerElements: [],
      },
    };
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        Object.assign(this.settings, val);
      },
    },
  },
  methods: {
      
  }
};
</script>

<style>
</style>