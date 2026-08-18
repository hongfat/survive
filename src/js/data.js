export const SURVIVAL_CATEGORIES = [
  { id: 'all', name: '全部指南', icon: 'grid' },
  { id: 'prep', name: '平時準備', icon: 'shield' },
  { id: 'crisis-shelter', name: '警報掩蔽', icon: 'alert-triangle' },
  { id: 'first-aid', name: '戰傷急救', icon: 'activity' },
  { id: 'tactical-safety', name: '戰場安全', icon: 'eye' },
  { id: 'comms-info', name: '通訊資訊', icon: 'radio' },
  { id: 'cbrn-disaster', name: '複合災害', icon: 'zap' },
  { id: 'checklist', name: '避難包點檢', icon: 'check-square' }
];

export const SURVIVAL_GUIDES = [
  {
    id: 'prep-household-supplies',
    categoryId: 'prep',
    title: '日常居家儲備與 7 天物資準備原則',
    severity: 'critical',
    summary: '依據國防部《臺灣全民安全指引》（<a href="https://prepare.mnd.gov.tw/emergency-supplies/househeld" target="_blank" rel="noopener">prepare.mnd.gov.tw/emergency-supplies/househeld</a>），居家防護應以家庭為單位儲備至少 7 天份生活物資，採「滾動式循環儲備 (FIFO)」維護效期。',
    steps: [
      '飲水儲備：以每人每日至少 3 公升計算，準備全家 7 天份飲用水與基礎清潔料理水。',
      '常溫糧食：儲備可常溫保存之罐頭、即食飯、泡麵、乾燥飯、能量餅乾與基本調味料。',
      '家庭急救箱：備妥優碘、棉棒、紗布、外傷藥膏及全家慢性病處方藥（至少 7 天份）。',
      '能源與照明：LED 應急燈、手電筒、多組 AA/AAA 備用電池、行動電源，並在通風良好處備卡式爐與瓦斯罐。',
      '管理原則：採「先進先出 (FIFO)」先進食舊存貨並補充新物資，分散儲放避免單點受損。'
    ],
    tips: [
      '家中有嬰幼兒、長者或寵物者，應預先儲備專用奶粉、尿布、助聽器電池或寵物飼料。'
    ]
  },
  {
    id: 'prep-gobag-basics',
    categoryId: 'prep',
    title: '個人緊急避難包準備與 1 至 3 天撤離配比',
    severity: 'critical',
    summary: '依據國防部指引（<a href="https://prepare.mnd.gov.tw/emergency-supplies/personal" target="_blank" rel="noopener">prepare.mnd.gov.tw/emergency-supplies/personal</a>），撤離時每人應獨立攜帶一包維持 1 至 3 天生存需求之雙肩避難包，重量控制於體重 10% 至 15%（男性約 15 公斤，女性約 10 公斤）。',
    steps: [
      '放置隨手可及處：選擇質輕防水雙肩後背包，放置於玄關、大門口或床頭隨手可抓取位置。',
      '每人獨立備包：每位家庭成員獨立準備一包，切勿多人共用一包，確保撤離逃生效率。',
      '核心隨身物資：飲用水、能量乾糧（1-3 天）、個人急救包與處方藥、證件影本與小額現金。',
      '防護保暖與工具：保暖太空毯、輕便雨衣、耐磨工作手套、高分貝哨子、手電筒、防災收音機。',
      '定期維護提醒：每 6 個月檢查糧食藥品效期，可善用「消防防災 e 點通 App」設定半年維護提醒。'
    ],
    tips: [
      '建議將袋內物資使用透明夾鏈袋分裝密封，確保泡水時物資仍可正常使用。'
    ]
  },
  {
    id: 'prep-shelter-locations',
    categoryId: 'prep',
    title: '認識周邊防空避難設施與急救醫院',
    severity: 'info',
    summary: '平時善用「消防防災 e 點通 App」或警政服務 App 預先查詢居家、學校與公司周邊之防空避難處所及緊急醫療責任醫院。',
    steps: [
      '下載安裝「消防防災 e 點通 App」或「警政服務 App」查閱離線避難地圖。',
      '實地走訪：確認居家周邊地下室、捷運站、大樓地下停車場之避難入口位置。',
      '預設家庭會合地點：約定通訊中斷時之主要與次要防災會合點（如鄰近公園或學校）。',
      '了解責任醫院：記下區域重大傷患處置責任醫院位置與路線。'
    ],
    tips: [
      '防空避難設施多數為大樓地下室，平時屬私有產權，防空警報發布後方開放民眾避難。'
    ]
  },
  {
    id: 'crisis-air-raid-siren',
    categoryId: 'crisis-shelter',
    title: '防空警報聲音識別與聽覺訊號判讀',
    severity: 'critical',
    summary: '國防部規範防空警報聲響識別標準：緊急防空警報為「1 長音 2 短音」，重複 3 次；解除警報為「1 長音持續 90 秒」。',
    steps: [
      '緊急防空警報聲音：1 次長音（15 秒）配合 2 次短音（各 5 秒），每音間隔 5 秒，重複 3 次，全程共 115 秒。',
      '警報發布處置：聽聞緊急警報時，立即放下手邊工作，停止駕車，迅速就地避難。',
      '解除警報聲音：連續發出 1 次長音持續 90 秒。',
      '警報解除處置：聽到解除警報後，仍需隨時保持警戒，配合民防人員指示移動。'
    ],
    tips: [
      '若電力或警報器故障，廣播車或巡邏車將以高音喇叭播放警報音訊。'
    ]
  },
  {
    id: 'crisis-shelter-posture',
    categoryId: 'crisis-shelter',
    title: '空襲與防空避難三原則及防護姿勢',
    severity: 'critical',
    summary: '聽到空襲警報或爆炸聲響時，遵循「地下優於地上、室內優於室外、遠離外牆門窗」原則，迅速採取防空避難姿勢。',
    steps: [
      '選擇避難處所：優先進入地下室、大樓鋼筋混凝土核心區或無窗衛浴間。',
      '採取防空姿勢：背向爆心方向俯臥，身體離開地面（避開地面衝擊波震傷內臟）。',
      '頭胸安全防護：雙肘撐地，胸部稍微抬離地面，雙手遮住頭部與頸部。',
      '五官保護措施：張開嘴巴（平衡中耳氣壓防止鼓膜破裂），緊閉雙眼與雙耳。',
      '等待衝擊波過後：確認無二次坍塌風險後，再遵循指示離開避難處所。'
    ],
    tips: [
      '駕駛車輛時應立即靠邊停妥，離車進入路旁地下避難設施。'
    ]
  },
  {
    id: 'first-aid-tccc-bleeding',
    categoryId: 'first-aid',
    title: '大量出血處置、部位限制與 CAT 止血帶使用',
    severity: 'critical',
    summary: '肢體動脈噴射性出血能在 3 分鐘內引發失血性休克致死。依傷口部位採取直接加壓、抬高患肢或止血帶，嚴禁於頭頸及軀幹使用止血帶。',
    steps: [
      '四肢動脈大出血：優先直接加壓包紮並抬高患肢。若無效，立即於傷口上方 5 至 8 公分處使用 CAT 止血帶（避開關節，標註使用時間，不可超過 1 小時）。',
      '頭頸部出血：嚴禁使用止血帶！保持氣道暢通，用乾淨布料輕壓傷口周圍，不可壓迫頸動脈。',
      '胸腹部出血與異物刺入：嚴禁使用止血帶！異物切勿拔除，於周圍加圈墊固定包紮；無異物用無菌敷料輕壓。',
      '戰場/災場處置：止血帶使用會產生劇烈疼痛屬正常現象，切勿隨意鬆開止血帶。'
    ],
    tips: [
      '頭、頸、胸、腹部傷口絕對禁止使用止血帶。止血帶僅限用於四肢動脈大出血。'
    ]
  },
  {
    id: 'first-aid-cpr-unconscious',
    categoryId: 'first-aid',
    title: '無意識傷患評估、CPR 與復原姿勢 (Recovery Position)',
    severity: 'critical',
    summary: '評估傷患意識與呼吸狀態。無呼吸立即實施 CPR 胸外按壓；有呼吸但無意識則採「復原姿勢」防止呼吸道阻塞。',
    steps: [
      '檢查意識與呼吸：輕拍雙肩大聲呼喚，觀察胸廓起伏（不大於 10 秒）。',
      '無呼吸無脈搏：立即指定人員撥打 119 與取得 AED，實施純按壓心肺復甦術 (Hands-Only CPR)，深度 5 至 6 公分，頻率每分鐘 100 至 120 次。',
      '有呼吸但無意識（無脊椎外傷疑慮）：採「復原姿勢 (Recovery Position)」，將傷患側臥、頭部後仰，下腳伸直上腳彎曲支撐，防止舌後墜或嘔吐物窒息。',
      '防範失溫：急救過程使用保暖毯包覆無傷部位，失溫會嚴重破壞血液凝血機制。'
    ],
    tips: [
      '若懷疑脊椎或頸椎受傷，切勿隨意翻轉為復原姿勢，應以壓額抬下巴法維護呼吸道。'
    ]
  },
  {
    id: 'first-aid-fracture-fix',
    categoryId: 'first-aid',
    title: '骨折與肢體創傷固定原則',
    severity: 'warning',
    summary: '骨折處嚴禁加壓止血，重點在於妥善固定，避免骨碎片二度刺破血管神經。',
    steps: [
      '禁止直接加壓：骨折患處切勿直接施加強烈壓力，防止骨折端移位割傷周圍組織。',
      '尋找固定資材：利用副木、木板、硬紙板、樹枝或捲曲雜誌作為固定物。',
      '關節上下固定：固定範圍必須包含骨折處「上一個關節」與「下一個關節」，避免移動。',
      '切勿矯正矯直：若骨折肢體已嚴重彎曲變形，切勿強行拉直，應以變形姿勢直接固定。'
    ],
    tips: [
      '固定綁紮後應持續檢查患肢末端血液循環與感覺（摸末端脈搏與皮溫）。'
    ]
  },
  {
    id: 'first-aid-burns-care',
    categoryId: 'first-aid',
    title: '燒燙傷急救「衝脫泡蓋送」與防失溫處置',
    severity: 'warning',
    summary: '熱輻射與火災燒燙傷急救處置，正確降溫包紮可預防嚴重繼發感染與失溫休克。',
    steps: [
      '衝：用清潔流動冷水沖洗傷口 15 至 30 分鐘，迅速降溫減輕組織傷害。',
      '脫/蓋：小心脫去傷口周圍衣物，若衣物黏連傷口切勿強行剝離；用無菌紗布或乾淨布料覆蓋保護。',
      '嚴禁破壞與塗抹：切勿弄破水泡，嚴禁塗抹油脂、牙膏、未消毒草藥或冰塊直接冰敷。',
      '防失溫保暖：大面積燒傷患極易失溫，降溫後應立即用保暖毯覆蓋身體非燒傷區域。'
    ],
    tips: [
      '失溫會大幅降低身體凝血功能，戰場與災場燒燙傷保暖與止血同等重要。'
    ]
  },
  {
    id: 'first-aid-evacuation-transport',
    categoryId: 'first-aid',
    title: '傷患搬運與移動原則及方式選擇',
    severity: 'warning',
    summary: '無立即生命危險切勿隨意移動傷患。必須搬運時依傷勢與人數選擇扶持法、揹負法、椅子法或擔架運送法。',
    steps: [
      '評估搬運時機：非現場有火災、爆炸、建物倒塌等立即危險，切勿任意移動傷患（防止脊椎二度重傷）。',
      '扶持法：適用於意識清醒、無骨折且能行走之輕傷者。',
      '揹負法：適用於長距離單人搬運，但「下樓梯或下坡時嚴禁使用揹負法」。',
      '椅子運送法：適用於傷患可坐立、無明顯脊椎與頸椎創傷者。',
      '擔架運送法：平地移動採「腳朝前」；遇到上坡、上樓梯、進入救護車或病房時，改為「頭朝前」。'
    ],
    tips: [
      '搬運過程中須隨時觀察傷患呼吸、面色與意識狀態變化。'
    ]
  },
  {
    id: 'tactical-safety-military',
    categoryId: 'tactical-safety',
    title: '戰場遭遇部隊應變：遠離與隱蔽原則',
    severity: 'critical',
    summary: '國防部最新《臺灣全民安全指引》規範：戰時環境極為複雜，民眾遭遇軍事部隊時應恪遵「遠離」與「室內隱蔽」原則。',
    steps: [
      '保持安全距離：發現軍事部隊、裝甲車輛或作戰小組時，切勿上前圍觀或靠近。',
      '室內隱蔽：迅速進入附近建築物內，遠離門窗，切勿在外逗留。',
      '嚴禁攝影：切勿使用手機拍照、錄影或將部隊戰術位置上傳網路社交平台。',
      '保持冷靜配合：遭遇檢查時，聽從國軍或警消人員指令，展現無敵意姿態。'
    ],
    tips: [
      '戰時敵我識別極為困難且敵軍可能偽裝，遠離戰術區域是確保個人安全的最佳作為。'
    ]
  },
  {
    id: 'tactical-safety-uxo',
    categoryId: 'tactical-safety',
    title: '未爆彈 (UXO) 與疑慮危險物品處理處置',
    severity: 'warning',
    summary: '空襲或砲擊過後，發現未爆炸之砲彈、飛彈殘骸、無人機或不明包裏，應實施「不接觸、不移動、上記號、快通報」。',
    steps: [
      '不接觸不移動：嚴禁好奇觸摸、踩踏或移動未爆彈殘骸。',
      '劃設安全範圍：離未爆彈至少 100 公尺以上，並警告現場其他民眾避開。',
      '設置醒目記號：在遠處明顯位置綁上紅布、設告示或立標示。',
      '通報警察與國軍：立即撥打 110 警政報案專線或 119 通報未爆彈位置與特徵。'
    ],
    tips: [
      '未爆彈可能隨時因振動、溫差或定時引信而引爆，絕對不可靠近拍攝。'
    ]
  },
  {
    id: 'comms-radio-regional',
    categoryId: 'comms-info',
    title: '通訊中斷時各地區防衛廣播頻道收聽對照',
    severity: 'warning',
    summary: '電力與網路中斷時，使用收音機調頻收聽官方漢聲廣播電台與警察廣播電台，獲取政府權威防災與國防訊息。',
    steps: [
      '漢聲廣播電台 (FM 國防資訊頻道)：北部/宜蘭 FM 106.5；竹苗中投/花蓮 FM 104.5；彰雲嘉南 FM 101.3；高屏/金門 FM 107.3（金門備用 FM 94.9）；台東關山 FM 105.3。',
      '警察廣播電台 - 全國治安交通網：北北基/桃園/宜蘭/雲嘉南/高屏 FM 104.9；竹苗/中彰投 FM 105.1；花東 FM 101.3（花蓮舞鶴 FM 106.5）。',
      '警察廣播電台 - 地區治安交通網：台北分台 FM 94.3；台中分台 FM 94.5；高雄分台 FM 93.1；宜蘭分台 FM 101.3。',
      '省電收聽策略：為節省電源，可約定於每整點（如 09:00、12:00）開啟收音機收聽 10 分鐘，紀錄水糧發放點與避難路線。'
    ],
    tips: [
      '若廣播系統因故受損，請直接至鄰近派出所或村里辦公處獲取官方訊息。',
      '平時宜儲放多組 AA/AAA 備用電池，並拉長收音機天線測試收聽狀況。'
    ]
  },
  {
    id: 'comms-disaster-app',
    categoryId: 'comms-info',
    title: '親友報平安與「消防防災 e 點通」系統',
    severity: 'info',
    summary: '原 1991 報平安專線與網站已於 2022 年底正式終止服務。現由內政部消防署「消防防災 e 點通 App」與「全民防災 e 點通 (<a href="https://bear.emic.gov.tw" target="_blank" rel="noopener">bear.emic.gov.tw</a>)」提供親友報平安與災區查詢服務。',
    steps: [
      '預先下載系統：於智慧型手機安裝「消防防災 e 點通 App」或瀏覽「全民防災 e 點通 (<a href="https://bear.emic.gov.tw" target="_blank" rel="noopener">bear.emic.gov.tw</a>)」。',
      '離線地圖功能：預先下載離線地圖，網路中斷時仍可查詢避難路線與緊急避難場所位置。',
      '發送平安簡訊：災時利用 App 內的「平安簡訊」功能，一鍵發送預設平安訊息與定位給親友（支援簡訊與社群平台）。',
      '災區親友現況查詢：至「災區親友現況查詢平台」查詢撤離、收容與傷亡人員資料，確認家屬安危。',
      '緊急求救電話：生命危急、火災或嚴重受困請直撥 119 或 110（切勿將報平安系統用於急難救助）。',
      '市政與民務諮詢：停水停電或民生物資諮詢請撥打 1999 市民熱線。'
    ],
    tips: [
      '平時與家人討論「家庭防災卡」，預先約定災時聯繫管道與主要/次要會合地點。'
    ]
  },
  {
    id: 'comms-disinformation',
    categoryId: 'comms-info',
    title: '戰時假訊息查證與認知防禦原則',
    severity: 'info',
    summary: '危機與戰時狀態下，敵方常散播假新聞、深偽 (Deepfake) 影音與恐慌言論。民眾應提高警覺，認明權威官方管道，不轉傳未經證實之網路傳言。',
    steps: [
      '認明權威官方管道：以總統府 (<a href="https://www.president.gov.tw/" target="_blank" rel="noopener">www.president.gov.tw</a>)、行政院 (<a href="https://www.ey.gov.tw/" target="_blank" rel="noopener">www.ey.gov.tw</a>) 及國防部《臺灣全民安全指引》( <a href="https://prepare.mnd.gov.tw/" target="_blank" rel="noopener">prepare.mnd.gov.tw</a>) 公告為準。',
      '查驗重大異動新聞：遇到「元首遭挾持」、「政府投降」或「水廠投毒」等極端傳言，切勿隨意轉發。',
      '善用民間第三方查核平台：通訊正常時使用台灣事實查核中心 (<a href="https://factcheck.org.tw/" target="_blank" rel="noopener">factcheck.org.tw</a>) 或 MyGoPen (<a href="https://www.mygopen.com/" target="_blank" rel="noopener">www.mygopen.com</a>) 查驗真實性。',
      '防範深偽 (Deepfake) 影音：戰時敵方可能利用 AI 生成政治人物偽造影音，應以廣播電台（漢聲/警廣）及官方新聞稿交叉比對。',
      '保持心理韌性：避免焦慮與集體恐慌傳播，專注於個人防護與社區互助。'
    ],
    tips: [
      '未經查證之戰時軍情傳言轉發可能觸犯法令並造成社會恐慌，請恪遵不造謠、不信謠、不傳謠原則。'
    ]
  },
  {
    id: 'comms-official-channels',
    categoryId: 'comms-info',
    title: '國家重大危機與防災官方資訊管道彙整',
    severity: 'info',
    summary: '彙整政府權威防災、國防動員與災害防救官方入口網站，便於平時儲存書籤與災時查詢權威發布。',
    steps: [
      '國防部全民安全指引：<a href="https://prepare.mnd.gov.tw/" target="_blank" rel="noopener">prepare.mnd.gov.tw</a>（全民國防應變手冊與應變指引）。',
      '國防部全民防衛動員署：<a href="https://aodm.mnd.gov.tw/" target="_blank" rel="noopener">aodm.mnd.gov.tw</a>（動員資訊、民防與全民國防手冊下載）。',
      '內政部全民防災 e 點通：<a href="https://bear.emic.gov.tw/" target="_blank" rel="noopener">bear.emic.gov.tw</a>（災害應變、避難地圖與親友報平安）。',
      '中央災害應變中心 (EMIC)：<a href="https://www.emic.gov.tw/" target="_blank" rel="noopener">www.emic.gov.tw</a>（即時災情處置與中央應變公告）。',
      '總統府新聞與聲明：<a href="https://www.president.gov.tw/" target="_blank" rel="noopener">www.president.gov.tw</a>（國家元首重大演講與緊急命令宣告）。'
    ],
    tips: [
      '建議將上述權威網站預先儲存於手機瀏覽器書籤或離線網頁，通訊微弱時快速取用。'
    ]
  },
  {
    id: 'cbrn-fallout-chemical',
    categoryId: 'cbrn-disaster',
    title: '核化生 (CBRN) 威脅與輻射塵防護',
    severity: 'critical',
    summary: '核爆產生強烈閃光、衝擊波與放射性輻射塵。遵循「時間、距離、遮蔽」防護三原則。',
    steps: [
      '避開核爆閃光：切勿直視閃光，立即背向爆心臥倒，掩住口鼻。',
      '15 分鐘內掩蔽：衝擊波過後，於 15 分鐘內進入最厚的鋼筋混凝土地下室或建築中心。',
      '密閉環境：關閉所有空調、換氣扇與門窗，用膠帶密封縫隙。',
      '脫除污染外衣：進入室內前脫下最外層衣物裝入塑膠袋密封（可消除 90% 輻射塵）。',
      '避難時間：在輻射塵避難所內持續停留至少 24 至 48 小時，待放射性自然衰變。'
    ],
    tips: [
      '切勿使用潤髮乳 (Conditioner)，其化學成分會使輻射顆粒緊密黏附於頭髮上。'
    ]
  },
  {
    id: 'cbrn-building-collapse',
    categoryId: 'cbrn-disaster',
    title: '建築物倒塌與火災煙霧緊急避難',
    severity: 'warning',
    summary: '遭遇砲擊或地震引發建物坍塌與火災時，冷靜應變並採用正確姿勢求生。',
    steps: [
      '火災濃煙避難：採低姿勢爬行（濃煙向上懸浮），用濕毛巾或衣物掩住口鼻。',
      '切勿搭乘電梯：火災與空襲時電梯極易斷電故障，一律走安全梯疏散。',
      '受困瓦礫堆：用衣物護住口鼻防塵，清除口鼻雜物，擴大生存呼吸空間。',
      '節省體力求救：聽到搜救聲響時，用硬物規律敲擊金屬管道或牆壁（三短三長三短）。'
    ],
    tips: [
      '受困時切勿盲目大聲喊叫，以免吸入過多粉塵或耗盡氧氣與體力。'
    ]
  },
  {
    id: 'checklist-mnd-gobag',
    categoryId: 'checklist',
    title: '個人緊急避難包 15 大物資點檢表（1-3 天撤離用）',
    severity: 'info',
    isInteractiveChecklist: true,
    summary: '參考國防部《當危機來臨時：臺灣全民安全指引》（<a href="https://prepare.mnd.gov.tw/emergency-supplies/personal" target="_blank" rel="noopener">prepare.mnd.gov.tw/emergency-supplies/personal</a>）規範之個人 1 至 3 天輕量避難包物資。請勾選已備妥項目，系統離線自動保存進度。',
    items: [
      { id: 'gb-water', text: '1. 飲用水：1.5 至 2 公升瓶裝水（每人每日至少 3L 基本生活水）。' },
      { id: 'gb-food', text: '2. 高熱量乾糧：能量棒、高熱量餅乾、肉乾（即開即食免加熱）。' },
      { id: 'gb-firstaid', text: '3. 個人急救包：CAT 止血帶、紗布、OK 繃、消毒棉片、個人慢性病藥物。' },
      { id: 'gb-lighting', text: '4. 照明與電力：手電筒、頭燈、備用電池、大容量行動電源。' },
      { id: 'gb-radio', text: '5. 通訊工具：手搖/電池防災收音機（收聽各地區漢聲/警廣頻道）、高分貝哨子。' },
      { id: 'gb-warmth', text: '6. 保暖防護：保暖防寒毯 (Space Blanket)、輕便雨衣、耐磨工作手套。' },
      { id: 'gb-tools', text: '7. 多功能工具：萬用刀具或萬用鉗、打火機/打火棒。' },
      { id: 'gb-docs', text: '8. 證件與現金：身分證件影本、印章、適量零錢與小額現金。' },
      { id: 'gb-hygiene', text: '9. 衛生用品：濕紙巾、口罩、衛生紙、消毒酒精。' },
      { id: 'gb-memo', text: '10. 記錄工具：防水筆與備忘筆記本（記錄緊急聯絡電話與「消防防災 e 點通」約定）。' },
      { id: 'gb-footwear', text: '11. 防護衣鞋：厚底運動鞋/安全鞋、長袖長褲（防碎玻璃破片）。' },
      { id: 'gb-towel', text: '12. 清潔毛巾：小型快乾毛巾或大毛巾（可掩口鼻防煙霧）。' },
      { id: 'gb-mask', text: '13. N95/防塵口罩：防護煙霧、火山灰或粉塵吸入。' },
      { id: 'gb-plasticbag', text: '14. 塑膠袋/垃圾袋：裝排泄物、防水包覆或緊急防水墊。' },
      { id: 'gb-whistle', text: '15. 求救哨子：配戴於胸前，遇受困時省力發出高分貝聲響。' }
    ],
    steps: [],
    tips: [
      '避難包總重量不應超過使用者體重的 10% 至 15%。',
      '每 6 個月定時檢查一次避難包內食物與藥品有效期限。'
    ]
  },
  {
    id: 'checklist-household-supplies',
    categoryId: 'checklist',
    title: '日常居家儲備 10 大物資點檢表（7 天居家避難用）',
    severity: 'info',
    isInteractiveChecklist: true,
    summary: '參考國防部《當危機來臨時：臺灣全民安全指引》（<a href="https://prepare.mnd.gov.tw/emergency-supplies/househeld" target="_blank" rel="noopener">prepare.mnd.gov.tw/emergency-supplies/househeld</a>）規範之 7 天居家避難物資。採「滾動式循環儲備 (FIFO)」，請勾選家中已備妥項目。',
    items: [
      { id: 'hh-water', text: '1. 居家飲用與生活水：每人每日至少 3 公升（全家 7 天份預備量）。' },
      { id: 'hh-food', text: '2. 常溫耐保存糧食：罐頭、即食飯、泡麵、乾燥飯、高熱量餅乾、基本調味料。' },
      { id: 'hh-firstaid', text: '3. 家庭急救箱：優碘、棉棒、無菌紗布、外傷藥膏、全家慢性病處方藥（至少 7 天份）。' },
      { id: 'hh-hygiene', text: '4. 居家衛生防疫：口罩、衛生紙、酒精噴霧、濕紙巾、洗沐用品、生理用品。' },
      { id: 'hh-lighting', text: '5. 應急照明與電池：LED 照明燈、手電筒、多組 AA/AAA 鹼性電池、大容量行動電源。' },
      { id: 'hh-radio', text: '6. 防災資訊廣播：可攜式 FM/AM 收音機（收聽各地區漢聲/警廣官方頻道）。' },
      { id: 'hh-cooking', text: '7. 簡易烹煮設備：卡式爐、備用卡式瓦斯罐（於通風良好處使用）、開罐器。' },
      { id: 'hh-tools', text: '8. 防護與清潔工具：耐磨工作手套、大號垃圾袋（處置排泄物/防水）。' },
      { id: 'hh-special', text: '9. 特殊成員物資：嬰幼兒奶粉紙尿褲、長者助聽器電池/輔具、寵物飼料與牽繩。' },
      { id: 'hh-app', text: '10. 數位維護提醒：下載「消防防災 e 點通 App」設定每 6 個月物資過期提醒。' }
    ],
    steps: [],
    tips: [
      '日常居家儲備應採「先進先出」原則隨時補充，分散放置避免單點破壞影響全家防護。'
    ]
  }
];
