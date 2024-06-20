<script setup>
// ================ Size Format Convertor ================
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const items = ref([]);
const fileName = ref("");
const fileSize = ref(0);

// ================ Drag-and-drop.vue ================
const event = reactive({
  drag: false,
  hover: false,
  drop: false,
  data: null,
});

const dragover = (e) => {
  e.preventDefault();
  event.drag = true;
};
const dragleave = (e) => {
  e.preventDefault();
  event.drag = false;
};
const mouseover = (e) => {
  e.preventDefault();
  event.hover = true;
};
const mouseleave = (e) => {
  e.preventDefault();
  event.hover = false;
};
const drop = (e) => {
  e.preventDefault();
  event.drag = false;
  event.drop = true;
  event.data = e.dataTransfer.files;
  if (e.dataTransfer?.files) {
    try {
      handleFile({ target: { files: e.dataTransfer.files } });
    } catch (error) {
      console.log("show error", error);
    }
  }
};

// ============= Function to handle file selection =================
const rawFiles = ref([]);
function handleFile(e) {
  const file = e.target.files;
  rawFiles.value.push(...file);
  for (let i = 0; i < rawFiles.value?.length; i++) {
    console.log("file", rawFiles.value[i]);
  }
}

// ============= Function to preview selected files =================

const imagePreviews = computed(() => {
  return rawFiles.value.map((file) => {
    return {
      file: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    };
  });
});

function setVideoPoster(event, defaultPoster) {
  const video = event.target;
  try {
    video.currentTime = 1; // Seek to the first second to get a frame
    video.poster = defaultPoster; // Set the default poster initially
  } catch (error) {
    console.error("Error setting video poster:", error);
    video.poster = "/images/default_poster.png"; // Fallback poster
  }
}
</script>
<template>
  <div class="flex flex-col items-center justify-center w-80 h-full">
    <label
      @dragover="dragover"
      @dragleave="dragleave"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
      @drop="drop"
      for="dropzone-file"
      class="drop-zone flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          v-if="items.length"
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-14 h-14 mb-2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 32 32"
        >
          <path
            fill="#20744a"
            fill-rule="evenodd"
            d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z"
          />
          <path
            fill="#20744a"
            d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z"
          />
          <path
            fill="#fff"
            fill-rule="evenodd"
            d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z"
          />
        </svg>
        <p class="mb-2 flex items-center gap-x-2" v-if="items.length">
          <span>{{ fileName }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <path
              fill="currentColor"
              stroke="currentColor"
              stroke-width="4"
              d="M24 33a9 9 0 1 0 0-18a9 9 0 0 0 0 18Z"
            />
          </svg>
          <span class="font-medium">{{ formatBytes(fileSize) }}</span>
        </p>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold" v-if="!items.length"
            >Click to upload</span
          >
          <span class="font-semibold" v-else>Click to change</span>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          CSV file type (MAX 5Mb)
        </p>
      </div>
      <input
        ref="input"
        type="file"
        accept="*/"
        @change="handleFile"
        class="hidden"
        multiple
        id="dropzone-file"
      />
    </label>

    <div v-if="rawFiles.length" class="w-full h-full bg-gray-50">
      <ul class="flex items-center p-1 gap-x-2 overflow-x-auto">
        <li
          v-for="(file, index) in imagePreviews"
          :key="index"
          class="relative group"
        >
          <img
            v-if="file.type?.startsWith('image/')"
            :src="file.file"
            class="max-w-[10rem] max-h-[5rem]"
            alt="image"
          />
          <video
            v-else-if="file.type?.startsWith('video/')"
            :src="file.file"
            class="max-w-[10rem] max-h-[5rem]"
            alt="video preview"
            @loadeddata="setVideoPoster($event, '/images/video_thumbnail.png')"
            @error="setVideoPoster($event, '/images/video_thumbnail.png')"
          />
          <Icon
            name="streamline:convert-pdf-2-solid"
            class="text-6xl text-gray-400"
            v-else-if="file.type === 'application/pdf'"
          />
          <Icon
            name="ri:file-excel-2-fill"
            class="text-6xl text-gray-400"
            v-else-if="
              file.type?.includes('excel') ||
              file.type?.includes('spreadsheetml')
            "
          />

          <button
            @click="rawFiles.splice(index, 1)"
            class="absolute -top-1 right-0 text-gray-500 group-hover:text-red-500"
          >
            <Icon
              name="carbon:close-filled"
              class="text-lg group-hover:text-xl duration-300"
            />
          </button>
        </li>
      </ul>
    </div>

    <div class="w-full" v-if="false">
      <!-- Uploading File Content -->
      <div class="mb-2 flex justify-between items-center w-full">
        <div class="flex items-center gap-x-3">
          <span
            class="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500"
          >
            <svg
              class="flex-shrink-0 size-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.0243 1.43996H7.08805C6.82501 1.43996 6.57277 1.54445 6.38677 1.73043C6.20077 1.91642 6.09631 2.16868 6.09631 2.43171V6.64796L15.0243 11.856L19.4883 13.7398L23.9523 11.856V6.64796L15.0243 1.43996Z"
                fill="#21A366"
              ></path>
              <path
                d="M6.09631 6.64796H15.0243V11.856H6.09631V6.64796Z"
                fill="#107C41"
              ></path>
              <path
                d="M22.9605 1.43996H15.0243V6.64796H23.9523V2.43171C23.9523 2.16868 23.8478 1.91642 23.6618 1.73043C23.4758 1.54445 23.2235 1.43996 22.9605 1.43996Z"
                fill="#33C481"
              ></path>
              <path
                d="M15.0243 11.856H6.09631V21.2802C6.09631 21.5433 6.20077 21.7955 6.38677 21.9815C6.57277 22.1675 6.82501 22.272 7.08805 22.272H22.9606C23.2236 22.272 23.4759 22.1675 23.6618 21.9815C23.8478 21.7955 23.9523 21.5433 23.9523 21.2802V17.064L15.0243 11.856Z"
                fill="#185C37"
              ></path>
              <path
                d="M15.0243 11.856H23.9523V17.064H15.0243V11.856Z"
                fill="#107C41"
              ></path>
              <path
                opacity="0.1"
                d="M12.5446 5.15996H6.09631V19.296H12.5446C12.8073 19.2952 13.0591 19.1904 13.245 19.0046C13.4308 18.8188 13.5355 18.567 13.5363 18.3042V6.1517C13.5355 5.88892 13.4308 5.63712 13.245 5.4513C13.0591 5.26548 12.8073 5.16074 12.5446 5.15996Z"
                fill="black"
              ></path>
              <path
                opacity="0.2"
                d="M11.8006 5.90396H6.09631V20.04H11.8006C12.0633 20.0392 12.3151 19.9344 12.501 19.7486C12.6868 19.5628 12.7915 19.311 12.7923 19.0482V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z"
                fill="black"
              ></path>
              <path
                opacity="0.2"
                d="M11.8006 5.90396H6.09631V18.552H11.8006C12.0633 18.5512 12.3151 18.4464 12.501 18.2606C12.6868 18.0748 12.7915 17.823 12.7923 17.5602V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z"
                fill="black"
              ></path>
              <path
                opacity="0.2"
                d="M11.0566 5.90396H6.09631V18.552H11.0566C11.3193 18.5512 11.5711 18.4464 11.757 18.2606C11.9428 18.0748 12.0475 17.823 12.0483 17.5602V6.8957C12.0475 6.6329 11.9428 6.38114 11.757 6.19532C11.5711 6.0095 11.3193 5.90475 11.0566 5.90396Z"
                fill="black"
              ></path>
              <path
                d="M1.13604 5.90396H11.0566C11.3195 5.90396 11.5718 6.00842 11.7578 6.19442C11.9438 6.38042 12.0483 6.63266 12.0483 6.8957V16.8162C12.0483 17.0793 11.9438 17.3315 11.7578 17.5175C11.5718 17.7035 11.3195 17.808 11.0566 17.808H1.13604C0.873012 17.808 0.620754 17.7035 0.434765 17.5175C0.248775 17.3315 0.144287 17.0793 0.144287 16.8162V6.8957C0.144287 6.63266 0.248775 6.38042 0.434765 6.19442C0.620754 6.00842 0.873012 5.90396 1.13604 5.90396Z"
                fill="#107C41"
              ></path>
              <path
                d="M2.77283 15.576L5.18041 11.8455L2.9752 8.13596H4.74964L5.95343 10.5071C6.06401 10.7318 6.14015 10.8994 6.18185 11.01H6.19745C6.27683 10.8305 6.35987 10.6559 6.44669 10.4863L7.73309 8.13596H9.36167L7.09991 11.8247L9.41897 15.576H7.68545L6.29489 12.972C6.22943 12.861 6.17387 12.7445 6.12899 12.6238H6.10817C6.06761 12.7419 6.01367 12.855 5.94748 12.9608L4.51676 15.576H2.77283Z"
                fill="white"
              ></path>
            </svg>
          </span>
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-white">
              preline-ui.xls
            </p>
            <p class="text-xs text-gray-500 dark:text-neutral-500">7 KB</p>
          </div>
        </div>
        <div class="inline-flex items-center gap-x-2">
          <a
            class="text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
            href="#"
          >
            <svg
              class="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="4" height="16" x="6" y="4"></rect>
              <rect width="4" height="16" x="14" y="4"></rect>
            </svg>
          </a>
          <a
            class="text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
            href="#"
          >
            <svg
              class="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </a>
        </div>
      </div>
      <!-- End Uploading File Content -->

      <!-- Progress Bar -->
      <div class="flex items-center gap-x-3 whitespace-nowrap w-full">
        <div
          class="flex w-full h-2 bg-gray-300 rounded-full overflow-hidden dark:bg-gray-300"
          role="progressbar"
          aria-valuenow="1"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-400 animate-pulse text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
            style="width: 40%"
          ></div>
        </div>
        <div class="w-6 text-end">
          <span class="text-sm text-gray-500">0%</span>
        </div>
      </div>
      <!-- End Progress Bar -->
    </div>
  </div>
</template>

<style scoped></style>
