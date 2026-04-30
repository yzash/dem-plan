export type Freshness = "green" | "amber" | "red";

export type InternalSignal = {
  system: string;
  type: string;
  eventsPerHour: number;
  freshness: Freshness;
  connector: string;
  sampleEventName: string;
  cadence: string;
  owner: string;
  lastSync: string;
  samplePayload: string;
};

export type ExternalSignal = {
  source: string;
  type: string;
  signalsPerDay: number;
  freshness: Freshness;
  connector: string;
  sampleEventName: string;
  cadence: string;
  owner: string;
  lastSync: string;
  samplePayload: string;
};

export type Signals = {
  internal: InternalSignal[];
  external: ExternalSignal[];
};

const json = (v: unknown) => JSON.stringify(v, null, 2);

export const signals: Signals = {
  internal: [
    {
      system: "SAP S/4HANA",
      type: "ERP / Master + Inventory",
      eventsPerHour: 4200,
      freshness: "green",
      connector: "OData v4 + CDC",
      sampleEventName: "MaterialDocumentPosted",
      cadence: "Realtime",
      owner: "Supply Chain IT",
      lastSync: "12 seconds ago",
      samplePayload: json({
        event: "MaterialDocumentPosted",
        plant: "IN01",
        material: "ST-1001",
        movementType: "601",
        qty: 240,
        uom: "EA",
        ts: "2025-04-30T07:14:22Z",
      }),
    },
    {
      system: "Centric PLM",
      type: "Product Lifecycle Mgmt",
      eventsPerHour: 320,
      freshness: "amber",
      connector: "REST + Webhook",
      sampleEventName: "StyleSpecPublished",
      cadence: "Every 15 min",
      owner: "Design Ops",
      lastSync: "4h ago",
      samplePayload: json({
        event: "StyleSpecPublished",
        styleCode: "ST-1014",
        season: "AW25",
        techPackVersion: "1.3",
        bom: ["fabric:cotton-rib", "trim:metal-zip-22cm"],
        publishedBy: "maya.iyer@brand.com",
        warning: "sync delayed: 4h since last poll",
      }),
    },
    {
      system: "Oracle POS",
      type: "Point of Sale",
      eventsPerHour: 18600,
      freshness: "green",
      connector: "Kafka topic",
      sampleEventName: "TransactionCommitted",
      cadence: "Realtime",
      owner: "Retail IT",
      lastSync: "2 seconds ago",
      samplePayload: json({
        event: "TransactionCommitted",
        store: "AE-DXB-04",
        items: [{ sku: "ST-1003-M-IND", qty: 1, lineTotalUSD: 38 }],
        tender: "VISA",
        ts: "2025-04-30T07:18:11Z",
      }),
    },
    {
      system: "Manhattan WMS",
      type: "Warehouse Management",
      eventsPerHour: 7400,
      freshness: "green",
      connector: "Webhook",
      sampleEventName: "InboundReceiptClosed",
      cadence: "Every 1 min",
      owner: "Logistics Ops",
      lastSync: "47 seconds ago",
      samplePayload: json({
        event: "InboundReceiptClosed",
        dc: "IN-MUM-DC2",
        po: "PO-203418",
        qtyReceived: 1840,
        styleCode: "ST-1007",
        receivedAt: "2025-04-30T06:55:00Z",
      }),
    },
    {
      system: "Shopify Plus",
      type: "E-commerce",
      eventsPerHour: 5300,
      freshness: "green",
      connector: "GraphQL Bulk + Webhook",
      sampleEventName: "OrderCreated",
      cadence: "Realtime",
      owner: "Digital Commerce",
      lastSync: "5 seconds ago",
      samplePayload: json({
        event: "OrderCreated",
        order: "#1024991",
        currency: "USD",
        lineItems: [{ variant: "ST-1011-S-SAGE", qty: 1, price: 49 }],
        country: "AE",
      }),
    },
    {
      system: "Salesforce CRM",
      type: "Customer 360",
      eventsPerHour: 1800,
      freshness: "green",
      connector: "Bulk API 2.0",
      sampleEventName: "ServiceCaseClosed",
      cadence: "Every 15 min",
      owner: "Customer Care",
      lastSync: "3 minutes ago",
      samplePayload: json({
        event: "ServiceCaseClosed",
        caseId: "5003J0000Q1Pq",
        topic: "fit-feedback",
        styleCode: "ST-1019",
        sentiment: "positive",
      }),
    },
    {
      system: "Loyalty",
      type: "CDP / Loyalty",
      eventsPerHour: 920,
      freshness: "green",
      connector: "Segment Source",
      sampleEventName: "TierUpgraded",
      cadence: "Every 5 min",
      owner: "Marketing Tech",
      lastSync: "30 seconds ago",
      samplePayload: json({
        event: "TierUpgraded",
        memberId: "mbr_88412",
        from: "Silver",
        to: "Gold",
        ltv: 612,
      }),
    },
    {
      system: "OMS",
      type: "Order Management",
      eventsPerHour: 6200,
      freshness: "green",
      connector: "REST",
      sampleEventName: "AllocationDecided",
      cadence: "Realtime",
      owner: "Supply Chain IT",
      lastSync: "8 seconds ago",
      samplePayload: json({
        event: "AllocationDecided",
        order: "OMS-22091",
        sourcedFrom: "FAC-IN-01",
        slaHours: 24,
      }),
    },
  ],
  external: [
    {
      source: "Instagram Hashtag Velocity",
      type: "Social listening",
      signalsPerDay: 18400,
      freshness: "green",
      connector: "Webhook (Brand24)",
      sampleEventName: "HashtagVelocitySpike",
      cadence: "Every 10 min",
      owner: "Trend Intel",
      lastSync: "4 minutes ago",
      samplePayload: json({
        event: "HashtagVelocitySpike",
        tag: "#oversizedtee",
        velocity24h: 12.4,
        postsLast24h: 84210,
        topMarkets: ["IN", "AE", "UK"],
        relatedStyles: ["ST-1001", "ST-1014"],
      }),
    },
    {
      source: "TikTok Trends",
      type: "Short-form video",
      signalsPerDay: 9100,
      freshness: "green",
      connector: "REST (TrendKit)",
      sampleEventName: "TrendEmerging",
      cadence: "Every 30 min",
      owner: "Trend Intel",
      lastSync: "12 minutes ago",
      samplePayload: json({
        event: "TrendEmerging",
        trend: "barrel-leg-jean",
        velocityScore: 0.87,
        marketShare: { US: 0.34, UK: 0.21, IN: 0.12 },
      }),
    },
    {
      source: "Google Trends",
      type: "Search intent",
      signalsPerDay: 4200,
      freshness: "green",
      connector: "REST",
      sampleEventName: "QueryBreakout",
      cadence: "Hourly",
      owner: "Trend Intel",
      lastSync: "23 minutes ago",
      samplePayload: json({
        event: "QueryBreakout",
        query: "linen dress",
        regions: ["IN", "AE"],
        breakout: "Breakout",
      }),
    },
    {
      source: "Pinterest Boards",
      type: "Inspiration / pinning",
      signalsPerDay: 3800,
      freshness: "green",
      connector: "REST",
      sampleEventName: "BoardSurge",
      cadence: "Hourly",
      owner: "Design Intel",
      lastSync: "44 minutes ago",
      samplePayload: json({
        event: "BoardSurge",
        boardTheme: "summer-utility",
        savesLast24h: 12480,
      }),
    },
    {
      source: "Vogue Runway",
      type: "Editorial / runway",
      signalsPerDay: 60,
      freshness: "amber",
      connector: "Manual + RSS",
      sampleEventName: "ShowPublished",
      cadence: "Daily",
      owner: "Design Intel",
      lastSync: "26 hours ago",
      samplePayload: json({
        event: "ShowPublished",
        designer: "Studio Mira",
        season: "AW26",
        keyLooks: ["oversized-trench", "rust-knit", "sage-slip"],
        warning: "feed stale: last poll > 24h",
      }),
    },
    {
      source: "WGSN",
      type: "Trend forecasting",
      signalsPerDay: 220,
      freshness: "green",
      connector: "REST (WGSN Connect)",
      sampleEventName: "ForecastUpdated",
      cadence: "Daily",
      owner: "Trend Intel",
      lastSync: "2 hours ago",
      samplePayload: json({
        event: "ForecastUpdated",
        macroTheme: "neo-pastoral",
        confidence: 0.78,
        adoptionLag: "8w",
      }),
    },
    {
      source: "Competitor Pricing",
      type: "Pricing intelligence",
      signalsPerDay: 5200,
      freshness: "green",
      connector: "Crawler + diff",
      sampleEventName: "PriceMoveDetected",
      cadence: "Every 30 min",
      owner: "Pricing Strategy",
      lastSync: "18 minutes ago",
      samplePayload: json({
        event: "PriceMoveDetected",
        competitor: "BrandX",
        styleClass: "linen-shirt",
        delta: -12,
        currency: "USD",
      }),
    },
  ],
};
