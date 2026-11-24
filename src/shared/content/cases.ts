import type { Schemas } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";

type Detail = Schemas["CaseDetailDto"];
type Texts = Pick<
  Detail,
  "achievements" | "category" | "description" | "name" | "shortDescription"
>;
type Shared = Omit<Detail, keyof Texts | "locale">;

// TEMPORARY: used while `API_URL` is not set (the site runs without the
// backend). Add or edit a case here: shared fields once, texts per locale. The
// data was copied from the backend (`GET /cases/{slug}?lang=ru|en`).
const cases: { shared: Shared; texts: Record<Locale, Texts> }[] = [
  {
    shared: {
      slug: "skygen",
      stack: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "REST API",
        "Docker",
        "kubernetes",
        "AI Agents",
        "LLM Integration",
        "Linux",
        "Prompt Engineering",
        "SEO",
        "Web Architecture",
        "Product Discovery",
        "Product Design",
        "Technical Planning",
        "AI-assisted Development",
        "Context Engineering",
        "Harness Engineering",
      ],
      projectLink: "https://skygen.ai",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/skygen/0b5e9cde15318a66.webp",
      blurImage:
        "data:image/webp;base64,UklGRioBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSKQAAAANgFvbtqpqX8Hd3SHVPogowFqiCBogIqIFCnB3ty/34VJCREyALJ7LukDwVNRK1R+CtHy9veA1U+uU4q+4nQq8ltThqO4iMscL3tHFwmrCLBLevSiMGkLl+Cq5vHchIMA/JQDIwwUgeKx7TYTg5f8flROg7HXrFJzJ6eXvT6xPBhslqOz/DTa7SSMX++l0pYx4ZZLoN/pw+u1qftkPWz/ekIGLX1ZQOCBgAAAA8AMAnQEqFAAMAD7tYqpNqaWkIjAIATAdiWUAwNwi6sQnf6N/Aoy2AAD+41ok8Pc3Z3kdcqJ/4oG6vy8ioTWL8daeFHg/OhlFgP9aWBcW0Jg5LMXykvmPoHcf6iuQsIAA",
      role: "PRODUCT",
      company: "AIPeople",
      teamSize: 9,
      startedAt: "2026-02-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title:
              "Инициирование и разработка SEO-конструктора рекламных сайтов",
            description:
              "Предложил идею внутреннего конструктора рекламных лендингов для масштабирования SEO-продвижения компании. Спроектировал решение и разработал шаблонизатор с визуальным редактором, готовыми шаблонами и инструментами SEO-оптимизации. Конструктор позволил маркетинговой команде самостоятельно создавать и публиковать до 12 оптимизированных лендингов за рабочий день, расширяя поисковое присутствие компании и улучшая позиции по целевым запросам",
            metric:
              "До 12 SEO оптимизированных лендингов создавалось за один рабочий день",
          },
          {
            title: "Product Discovery и развитие технологии Computer Use",
            description:
              "Участвовал в формировании продуктового направления Computer Use технологии, позволяющей AI-агентам управлять полноценной операционной системой через визуальное восприятие интерфейса. Исследовал рынок и существующие решения, анализировал пользовательские сценарии, выявлял возможности развития и предлагал новые функции. Прорабатывал концепции и требования к функциональности, сопровождая развитие направления от идеи до выпуска готового решения",
            metric:
              "Продуктовое развитие Computer Use на основе исследований рынка и пользовательских сценариев",
          },
          {
            title: "Построение AI-first процессов продуктовой разработки",
            description:
              "Инициировал и внедрял изменения во внутренних процессах разработки, организовывал планирование и приоритизацию задач, выстраивал взаимодействие между разработчиками, дизайнерами и продуктовыми участниками. Внедрял новые инструменты и рабочие практики, включая AI-инструменты для повседневной разработки. Формировал более прозрачный и согласованный процесс работы команды, ускоряя переход от продуктовых идей к технической реализации и повышая эффективность совместной работы",
            metric:
              "Внедрение AI-инструментов и единого процесса планирования и разработки продукта",
          },
        ],
        category: "AI-платформа",
        description:
          "Участвовал в развитии Skygen в роли Product Engineer, совмещая техническую реализацию с проработкой продуктовых решений и развитием функциональности. Принимал активное участие в формировании направления развития платформы: выявлял возможности для улучшения продукта, предлагал новые функции, проектировал решения и реализовывал их на всех этапах — от идеи до внедрения. Ключевыми направлениями работы стали технология Computer Use, позволяющая AI агентам взаимодействовать с полноценными Linux средами посредством визуального восприятия интерфейса, и внутренний SEO конструктор лендингов, созданный для масштабирования маркетинговых процессов компании",
        name: "Skygen",
        shortDescription:
          "AI-платформа, объединяющая автономное взаимодействие с компьютером, интеллектуальных агентов и инструменты автоматизации внутренних процессов роста компании",
      },
      en: {
        achievements: [
          {
            title: "Initiation and Development of an SEO Landing Page Builder",
            description:
              "Proposed the idea of building an internal landing page platform to scale the company's SEO efforts. Designed the solution concept and developed a templating system featuring a visual editor, ready-made templates, and SEO optimization tools. The builder enabled the marketing team to independently create and publish up to 12 optimized landing pages per working day, significantly expanding the company's search presence and helping it achieve higher rankings for targeted search queries",
            metric:
              "Up to 12 SEO-optimized landing pages created in a single working day",
          },
          {
            title:
              "Product Discovery and Development of Computer Use Technology",
            description:
              "Contributed to shaping the Computer Use product direction — a technology that enables AI agents to control a full operating system through visual interface perception. Conducted market research and analyzed existing solutions, explored user scenarios, identified opportunities for further development, and proposed new features. Helped define feature concepts and requirements, contributing to the development process from initial idea through to the release of a production-ready solution",
            metric:
              "Computer Use product development driven by market research and user scenario analysis",
          },
          {
            title: "Building AI-First Product Development Processes",
            description:
              "Initiated and implemented improvements to internal development workflows, organized planning and task prioritization, and established effective collaboration between developers, designers, and product stakeholders. Introduced new tools and working practices, including AI-powered tools for everyday development. Helped establish a more transparent and coordinated team workflow, improving collaboration and streamlining the transition from product ideas to technical implementation",
            metric:
              "Introduced AI tools and a unified product planning and development workflow",
          },
        ],
        category: "AI Platform",
        description:
          "Contributed to the development of Skygen as a Product Engineer, combining technical implementation with product discovery and feature development. Played an active role in shaping the platform's direction by identifying opportunities for improvement, proposing new features, designing solutions, and delivering them end to end - from initial concept to implementation. Key areas of contribution included Computer Use technology, enabling AI agents to interact with full Linux environments through visual interface perception, and an internal SEO landing page builder designed to scale the company's marketing operations",
        name: "Skygen",
        shortDescription:
          "An AI platform combining autonomous computer interaction, intelligent agents, and tools for automating internal business growth processes",
      },
    },
  },
  {
    shared: {
      slug: "spectre",
      stack: [
        "React",
        "Remix",
        "MobX",
        "Tailwind",
        "Ethers",
        "Wagmi",
        "Reown",
        "TanStack",
        "Recharts",
        "Storybook",
        "Vite",
        "Webpack",
        "Vitest",
        "Playwright",
        "OpenAPI",
        "Husky",
        "CSS",
        "HTML",
        "AI-assisted Development",
        "Context Engineering",
        "Harness Engineering",
      ],
      projectLink: "https://thespectre.io",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/spectre/67bcf7425e245943.webp",
      blurImage:
        "data:image/webp;base64,UklGRiYBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSL8AAAANuS5E9D8At7Zt1co+9353/0BGaCnUTgFuNRC5O1fOPRuvIWICJsAlMCs2JdvOAMHPB7surFtyS6kDoqEG/lw0E13asMUpHmQj8DeJsQVeAFV1rwhI/JbdG6o4kTleElSQgN/Nq3PeqQqAKvg3KRAEQOJfIAwBgAASIAiABIBQBTkEGXk1hRIADgA8OVchAMSHd9lIVNeQBARGvatoeTVgDHy4EQ2YgEwUqYaZgSDwCqO6gifLKhRVVCROW9+7AgBWUDggQAAAAFADAJ0BKhQADAA+7WSqTamlpCIwCAEwHYlnAL84LQeE7eAAAP7tp53BKQyw9ybZl+WcahR62xpaXbGDiKhJEAA=",
      role: "FRONTEND",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title:
              "Высокопроизводительная визуализация сложных структур данных",
            description:
              "Проектировал и разрабатывал сложные data-heavy интерфейсы для визуализации и анализа данных: интерактивные диаграммы, динамические графики, рекурсивные компоненты для парсинга и отображения кода, а также высокопроизводительные realtime-таблицы для отображения и обработки миллионов записей с динамическим обновлением данных и другие нестандартные UI-компоненты",
            metric: "Выросла вовлеченность пользователей",
          },
          {
            title:
              "Построение харнес для надёжной AI-разработки с многоуровневой проверкой кода",
            description:
              "Выстроил процесс AI-assisted разработки с многоуровневой системой контроля качества: обеспечил 90% покрытия кода unit-тестами, покрыл ключевые пользовательские сценарии E2E-тестами и реализовал полное покрытие дизайн-системы в Storybook. Созданная инфраструктура позволила AI-агентам проверять корректность реализации по независимым критериям, повысив качество и предсказуемость генерируемого кода",
            metric:
              "Генерация кода ИИ стала более контролируемой, проверяемой и предсказуемой",
          },
          {
            title: "Создание масштабируемой мультипроектной архитектуры",
            description:
              "Спроектировал и реализовал архитектуру для поддержки трёх независимых проектов на единой кодовой базе. Адаптировал существующий продукт под два дополнительных блокчейна и внедрил гибкую систему конфигурации и кастомизации, позволяющую учитывать различия между проектами, сохраняя общую бизнес-логику и упрощая внедрение обновлений",
            metric:
              "Ускорен запуск новых проектов и распространение обновлений",
          },
        ],
        category: "FinTech / Web3-приложение",
        description:
          "Spectre - блокчейн-эксплорер с уникальными возможностями для изучения и анализа данных Ethereum и других блокчейн-сетей. Сервис собирает и показывает информацию о транзакциях, блоках, адресах и токенах, делая данные полностью прозрачными и доступными для каждого пользователя. Также Spectre предоставляет API, с которым удобно работать с этими данными.",
        name: "The Spectre Explorer",
        shortDescription:
          "Spectre - быстрый и надёжный веб-сервис для поиска платежей и активов в блокчейне.",
      },
      en: {
        achievements: [
          {
            title: "High-Performance Visualization of Complex Data Structures",
            description:
              "Designed and developed complex data-heavy interfaces for data visualization and analysis, including interactive charts, dynamic graphs, recursive components for parsing and displaying code, high-performance real-time tables for displaying and processing millions of records with dynamically updated data, and other specialized UI components",
            metric: "Increased user engagement",
          },
          {
            title:
              "Building a Harness for Reliable AI-Assisted Development with Multi-Layer Code Validation",
            description:
              "Established an AI-assisted development workflow with a multi-layered quality assurance system: achieved 90% unit test coverage, implemented E2E tests for key user journeys, and ensured complete Storybook coverage of the design system. This infrastructure enabled AI agents to validate implementations against multiple independent criteria, improving the quality and predictability of AI-generated code",
            metric:
              "Made AI-generated code more controlled, verifiable, and predictable",
          },
          {
            title: "Building a Scalable Multi-Product Architecture",
            description:
              "Designed and implemented an architecture supporting three independent projects on a shared codebase. Extended the existing product to support two additional blockchains and introduced a flexible configuration and customization system that accommodates project-specific requirements while preserving shared business logic and streamlining updates across all three products.",
            metric:
              "Accelerated new product launches and update delivery across all three projects",
          },
        ],
        category: "FinTech / Web3 App",
        description:
          "Spectre is a Blockchain Explorer that provides unique capabilities for exploring and analyzing data from Ethereum and other blockchain networks. Spectre gathers and displays information about transactions, blocks, addresses, and tokens across these networks, ensuring full transparency and accessibility of data for users, as well as offering an API for convenient data manipulation.",
        name: "The Spectre Explorer",
        shortDescription:
          "Spectre - a fast, reliable web service that lets anyone look up blockchain payments and assets.",
      },
    },
  },
  {
    shared: {
      slug: "graphite-wallet",
      stack: [
        "TypeScript",
        "JavaScript",
        "Vue",
        "Node.js",
        "JSON-RPC",
        "Wagmi",
        "Ethers",
        "Reown AppKit",
        "Browser Extension APIs",
      ],
      projectLink:
        "https://chromewebstore.google.com/detail/graphite-wallet/fbgdgmhhhlimaanngeakidegojjbbbbm",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/graphite-wallet/0861e7e0863ccef9.webp",
      blurImage:
        "data:image/webp;base64,UklGRigBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSJ4AAAANgFzb1rLmfoq7u7vU4mMWRdECFWgBNEABrIx85P5JPCkhIiZAdGbTDL61eNwt9ga277q5wS+Z2yOMnt9fqF9YX6Xotnpwb/GbcL3oICxm8GtX2AMq8K/E/okAihIA5DtLQCxwyIYofrRKcU6AZSblc3EuqXl9U9ev4SgBVnfKH0uG3VLfXl1e+6opbvTp8RTxfNzD7N3pickWfMK8AVZQOCBkAAAAEAQAnQEqFAAMAD7tZKlNqaWkIjAIATAdiWMAvzgi7f7B+Maoul96sgAA/uWvqJD/aEt+wSf06Mi6QwHZJEEr6FRGvbuQ8N0NuQwSywxeAz4gMeGim+gssdYQY1NRNIJAZmIAAA==",
      role: "FULLSTACK",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title: "Стандартизация интеграции кошелька с Web3-экосистемой",
            description:
              "Преобразовал проприетарный API кошелька в стандартный EIP-1193-провайдер, позволяющий dApp взаимодействовать с Graphite Wallet так же, как с MetaMask или Trust Wallet. Реализовал RPC-методы для доступа к аккаунту, подписания сообщений и транзакций, переключения сетей и добавления токенов. Унифицировал форматы данных, события и обработку ошибок, добавил автоматическое обнаружение кошелька через EIP-6963. Обеспечил совместимость с wagmi, ethers и Reown AppKit без отдельных адаптеров",
            metric: "Совместимость с dApp без отдельных адаптеров",
          },
          {
            title: "Глобальный рефакторинг архитектуры кошелька",
            description:
              "Провёл масштабный рефакторинг кодовой базы Graphite Wallet, переработав структуру приложения, ключевые модули и механизмы взаимодействия между компонентами. Устранил накопившиеся архитектурные ограничения и упорядочил внутреннюю реализацию существующей функциональности. Рефакторинг заложил основу для дальнейшего развития кошелька, упростил поддержку кодовой базы и внедрение новых возможностей",
            metric:
              "Масштабная переработка архитектуры и ключевых модулей кошелька",
          },
          {
            title: "Разработка механизмов активации аккаунта и KYC-фильтрации",
            description:
              "Расширил функциональность кошелька, добавив ранее отсутствовавшие сценарии активации блокчейн-аккаунта и управления KYC. Реализовал изменение уровня верификации пользователя и настройку фильтров входящих транзакций, позволяющих ограничивать приём переводов в зависимости от уровня проверки отправителя. Интегрировал эти возможности непосредственно в интерфейс кошелька, предоставив пользователям управление механизмами безопасности сети без сторонних инструментов",
            metric:
              "Активация аккаунта и управление KYC фильтрами непосредственно в кошельке",
          },
        ],
        category: "FinTech / Browser Extension",
        description:
          "Разрабатывал и развивал Graphite Wallet — браузерный Web3-кошелёк для работы с Graphite Network и децентрализованными приложениями. Основными направлениями работы стали стандартизация API для подключения сторонних dApp, масштабный рефакторинг кодовой базы и расширение функциональности под специфические механизмы сети. Реализовал совместимость с популярными Web3-инструментами, а также пользовательские сценарии активации аккаунта, управления уровнями KYC и фильтрации входящих транзакций",
        name: "Graphite Wallet",
        shortDescription:
          "Браузерный Web3-кошелёк с поддержкой децентрализованных приложений, управления аккаунтами, блокчейн-транзакциями и встроенными механизмами KYC и фильтрации входящих переводов",
      },
      en: {
        achievements: [
          {
            title:
              "Standardization of Wallet Integration with the Web3 Ecosystem",
            description:
              "Converted the wallet's proprietary API into a standard EIP-1193 provider, allowing dApps to connect just as they do with MetaMask or Trust Wallet. Implemented RPC methods for account access, message and transaction signing, network switching, and token management. Standardized data formats, events, and errors, and added EIP-6963 wallet discovery. Enabled out-of-the-box compatibility with wagmi, ethers, and Reown AppKit, without custom adapters",
            metric:
              "Out-of-the-box compatibility with wagmi, ethers, and Reown AppKit",
          },
          {
            title: "Comprehensive Refactoring of the Wallet Architecture",
            description:
              "Carried out a major refactoring of the Graphite Wallet codebase, restructuring the application architecture, core modules, and interactions between components. Addressed accumulated architectural limitations and streamlined the implementation of existing functionality. The refactoring established a foundation for further product development, making the codebase easier to maintain and extend with new capabilities",
            metric:
              "Comprehensive restructuring of the wallet architecture and core modules",
          },
          {
            title:
              "Implementation of Account Activation and KYC-based Transaction Filtering",
            description:
              "Expanded the wallet's functionality by introducing previously unsupported account activation and KYC management workflows. Implemented KYC level management and configurable incoming transaction filters, allowing users to control which transfers their accounts accept based on the sender's verification level. Integrated these capabilities directly into the wallet interface, enabling users to manage network-specific security features without relying on external tools",
            metric:
              "Account activation and KYC-based transaction filtering built directly into the wallet",
          },
        ],
        category: "FinTech / Browser Extension",
        description:
          "Contributed to the development of Graphite Wallet, a browser-based Web3 wallet built for the Graphite Network ecosystem and decentralized applications. Key areas of work included standardizing the API for third-party dApp integration, carrying out a major codebase refactoring, and expanding wallet functionality to support network-specific features. Implemented compatibility with major Web3 tools, along with user workflows for account activation, KYC management, and incoming transaction filtering",
        name: "Graphite Wallet",
        shortDescription:
          "A browser-based Web3 wallet for Graphite Network, featuring decentralized application connectivity, account management, blockchain transactions, and built-in KYC and incoming transaction filtering",
      },
    },
  },
  {
    shared: {
      slug: "bridge-graphite",
      stack: [
        "React",
        "TypeScript",
        "NestJS",
        "Node.js",
        "Docker",
        "Doscker Compose",
        "Kubernetes",
        "CI/CD",
        "WebSocket",
        "PostgreSQL",
        "Reown",
        "Wagmi",
        "Solana",
        "Web3.js",
        "Ethers",
        "Viem",
        "Tanstack",
      ],
      projectLink: "https://bridge.atgraphite.com",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/bridge-graphite/f8efecbc519f4098.webp",
      blurImage:
        "data:image/webp;base64,UklGRgIBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSJ8AAAANcBvbtqqc83DP3CPrxiGjMeqgBYpwd3e+4VJCREyAIG/xcilI4u26WqkFzXp5t5Hx2RL0IG0xXjr15RfGaMqTo1DG9TlvH4QjHIgpmpAO5xs+U2/CXwng9gPxyhtuIIAbAKrKjYAs06i7Ea+3/WAMgLuJ6jKbTJSk62U/HW2PeoFda2ryup3ivJuNVjeneWkyqNdFX/L7rVQOw4HkNBAAVlA4IDwAAACQAwCdASoUAAwAPu1krU6ppaSiMAgBMB2JZwAAUqac0Ziy7iYAAP67DUM2xZWBL+lElKAmixYdGch/0AA=",
      role: "FULLSTACK",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title:
              "Внедрение унифицированной архитектуры интеграции криптокошельков",
            description:
              "Адаптировал и внедрил в Bridge Graphite унифицированный подход к подключению криптокошельков, основанный на универсальной библиотеке с единым API. Интеграция позволила отказаться от отдельных реализаций для каждого провайдера, сохранить единый механизм взаимодействия с кошельками и упростить поддержку новых способов подключения",
            metric:
              "Единый механизм подключения для десятков криптокошельков вместо разрозненных интеграций",
          },
          {
            title: "Разработка интерфейса для кроссчейн-переводов",
            description:
              "Реализовал пользовательский сценарий перевода токенов между различными блокчейн-сетями. Объединил подключение кошелька, выбор целевой сети и подтверждение операции в последовательный интерфейс, скрывающий техническую сложность межсетевого взаимодействия. Обеспечил согласованную работу интерфейса с данными и состояниями операций",
            metric:
              "Сложный межсетевой перевод объединён в единый последовательный сценарий",
          },
          {
            title: "Реализация истории и отслеживания кроссчейн-транзакций",
            description:
              "Разработал функциональность отслеживания истории переводов, позволяющую пользователям просматривать информацию о выполненных операциях и контролировать их состояние. Интегрировал отображение данных о транзакциях в интерфейс Bridge, сделав процесс взаимодействия с кроссчейн-переводами более прозрачным",
            metric:
              "История переводов и информация о состоянии операций доступны непосредственно в интерфейсе моста",
          },
        ],
        category: "FinTech / Web3-приложение",
        description:
          "Разработка и развитие веб-приложения для межсетевого перевода токенов Graphite. Bridge Graphite позволяет перемещать активы между Graphite Network, Ethereum, BNB Chain, Solana, Polygon и Arbitrum, используя привычные криптокошельки. Приложение объединяет подключение кошелька, выбор сетей и выполнение переводов в единый пользовательский сценарий. В основе решения лежит модульная архитектура обработки кроссчейн-транзакций, обеспечивающая подготовку, проверку и подтверждение переводов между сетями. Система также предусматривает прозрачную модель комиссий, включающую сетевые расходы и комиссию сервиса.",
        name: "Bridge Graphite",
        shortDescription:
          "Кроссчейн-мост для перевода токенов Graphite между Graphite Network и ведущими блокчейн-сетями.",
      },
      en: {
        achievements: [
          {
            title:
              "Implementation of a Unified Crypto Wallet Integration Architecture",
            description:
              "Adapted and integrated a unified approach to crypto wallet connectivity into Bridge Graphite, built around a universal library with a consistent API. This eliminated the need for separate implementations for individual wallet providers, established a standardized integration mechanism, and simplified the maintenance and addition of new wallet options",
            metric:
              "A unified integration mechanism for dozens of crypto wallets, replacing fragmented implementations",
          },
          {
            title: "Development of a Cross-Chain Transfer Interface",
            description:
              "Implemented the user-facing workflow for transferring tokens between different blockchain networks. Combined wallet connection, destination network selection, and transaction confirmation into a streamlined interface that abstracts the technical complexity of cross-chain interactions. Ensured consistent UI behavior across transaction data and states",
            metric:
              "Transformed a complex cross-chain transfer process into a single, streamlined user workflow",
          },
          {
            title:
              "Implementation of Cross-Chain Transaction History and Tracking",
            description:
              "Developed transaction tracking functionality that allows users to review their transfer history and monitor the status of individual operations. Integrated transaction data into the Bridge interface, making cross-chain activity more transparent and easier to manage",
            metric:
              "Transfer history and transaction status information available directly within the bridge interface",
          },
        ],
        category: "FinTech / Web3 App",
        description:
          "Developed and maintained a web application for cross-chain transfers of Graphite tokens. Bridge Graphite enables users to move assets between Graphite Network, Ethereum, BNB Chain, Solana, Polygon, and Arbitrum using their existing crypto wallets. The application combines wallet connectivity, network selection, and transfer execution into a unified user experience. Its underlying solution relies on a modular architecture for cross-chain transaction processing, handling transfer preparation, verification, and confirmation across networks. The platform also provides a transparent fee structure covering network costs and service fees",
        name: "Bridge Graphite",
        shortDescription:
          "A cross-chain bridge for transferring Graphite tokens between Graphite Network and major blockchain networks",
      },
    },
  },
  {
    shared: {
      slug: "atgraphite",
      stack: [
        "React",
        "TypeScript",
        "Next.js",
        "Node.js",
        "NestJS",
        "Docker",
        "Doscker Compose",
        "Kubernetes",
        "CI/CD",
        "WebSocket",
        "PostgreSQL",
        "Reown",
        "Wagmi",
        "Solana",
        "Web3.js",
        "Ethers",
        "Viem",
      ],
      projectLink: "https://atgraphite.com",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/atgraphite/c721302fe94589a2.webp",
      blurImage:
        "data:image/webp;base64,UklGRh4BAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSLgAAAABgGNt2/EoXkA6q7ed1KmyCI4rYwlWa9dmadu2J9b3vv94thARE8DWNl6TH4GQ924bk8lkGHInwgD4HSDc7xHJJbzWmXuC1I+I4fHqwqri3NsYUr8ihlfGZg+2FglSf4nsbT1BJv6v7WfIJv619YzZRIogIv4S3tv+tvgAf4Cn1dUnzMaLBveuX8JJoCDx9jDbO/lN5i1vHdm8T2HmbnGwLNB2D8kXDlfiLh86jUPyqNunMNZcQeQcVlA4IEAAAABQAwCdASoUAAwAPu1kqk4ppaQiMAgBMB2JZwC/ODBR5oNkUAD+7law1SaqRRdVE97dg9MNz/dwxXLTstBT0AAA",
      role: "FULLSTACK",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title:
              "Проектирование и разработка автоматизированной платформы выполнения заданий",
            description:
              "Спроектировал backend-архитектуру и реализовал полноценную систему квестов для привлечения и удержания пользователей. Разработал набор Node.js-сервисов для автоматической верификации заданий различной сложности: от подписок и публикаций в социальных сетях до отслеживания долгосрочной блокчейн-активности. Реализовал интеграции с Telegram и Discord через ботов, OAuth и внешние API, систему фоновых проверок, учёта прогресса, начисления баллов и защиты от повторного выполнения",
            metric:
              "Полностью автоматизированная система вовлечения, ежедневно обслуживающая десятки пользователей",
          },
          {
            title: "Создание единой архитектуры интеграции криптокошельков",
            description:
              "Инициировал и реализовал переход от разрозненных интеграций к унифицированной архитектуре подключения криптокошельков. Проанализировал существующие решения, выбрал универсальную библиотеку и адаптировал её под инфраструктуру компании. Обеспечил единый API взаимодействия с десятками кошельков, сохранив совместимость существующих приложений и устранив необходимость разработки отдельных провайдеров для каждой интеграции",
            metric:
              "Подключение новых кошельков сведено к конфигурации вместо разработки отдельных интеграций",
          },
          {
            title: "Разработка комплексного сценария покупки цифровых активов",
            description:
              "Разработал многоэтапный интерфейс покупки токена @G, объединив выбор блокчейн-сети и актива, расчёт суммы покупки, ввод данных получателя и оформление транзакции в единый пользовательский сценарий. Реализовал взаимодействие между этапами покупки и обработку пользовательских данных, обеспечив последовательный и понятный процесс приобретения цифровых активов",
            metric:
              "Объединение сложного процесса покупки цифровых активов в единый интерфейс",
          },
        ],
        category: "FinTech / Web3-приложение",
        description:
          "Разработка и развитие веб-платформы Graphite Network, объединяющей информационные и интерактивные инструменты для пользователей блокчейн-экосистемы. Помимо презентации технологии и её возможностей, платформа предоставляет функциональность личного кабинета, управления аккаунтом, участия в Market Staking и получения вознаграждений за торговую активность. Также проект включал механики вовлечения пользователей через систему квестов и другие интерактивные сценарии. Платформа интегрирована с блокчейн-инфраструктурой и внешними Web3-сервисами, обеспечивая взаимодействие пользователей с финансовыми инструментами экосистемы",
        name: "Atgraphite",
        shortDescription:
          "Многофункциональная Web3-платформа для взаимодействия с Graphite Network, управления аккаунтом и участия в финансовых программах экосистемы",
      },
      en: {
        achievements: [
          {
            title: "Design and Development of an Automated Task Platform",
            description:
              "Designed the backend architecture and developed a comprehensive quest system to attract and retain users. Built a suite of Node.js services to automatically verify tasks of varying complexity, from social media subscriptions and posts to long-term blockchain activity. Implemented Telegram and Discord integrations using bots, OAuth, and external APIs, along with background verification processes, progress tracking, point allocation, and duplicate-submission prevention.",
            metric:
              "Fully automated user engagement system serving dozens of users daily",
          },
          {
            title:
              "Development of a Unified Crypto Wallet Integration Architecture",
            description:
              "Initiated and implemented the transition from fragmented wallet integrations to a unified architecture. Evaluated existing solutions, selected a universal library, and adapted it to the company's infrastructure. Established a single API for interacting with dozens of wallets while maintaining compatibility with existing applications and eliminating the need to develop separate providers for each integration.",
            metric:
              "Reduced new wallet integrations to configuration rather than custom provider development",
          },
          {
            title: "Development of an End-to-End Digital Asset Purchase Flow",
            description:
              "Developed a multi-step interface for purchasing the @G token, bringing blockchain network and asset selection, purchase amount calculation, recipient details, and transaction submission into a single user flow. Implemented step-to-step interactions and user data handling to provide a clear and consistent digital asset purchase experience",
            metric:
              "Unified a complex digital asset purchasing process into a single, streamlined interface",
          },
        ],
        category: "FinTech / Web3 App",
        description:
          "Developed and maintained the Graphite Network web platform, combining informational content with interactive tools for blockchain ecosystem users. In addition to presenting the technology and its capabilities, the platform provides account management features, access to Market Staking, and rewards for trading activity. It also includes user engagement features such as a quest system and other interactive workflows. The platform integrates with blockchain infrastructure and external Web3 services, enabling users to interact with the ecosystem's financial tools.",
        name: "Atgraphite",
        shortDescription:
          "A multifunctional Web3 platform for interacting with Graphite Network, managing user accounts, and participating in ecosystem financial programs.",
      },
    },
  },
  {
    shared: {
      slug: "ube",
      stack: [
        "React",
        "TypeScript",
        "Node.js",
        "NestJS",
        "Docker",
        "Tailwindcss",
        "Webpack",
        "MobX",
        "Material UI",
        "Jest",
        "Vitest",
        "REST API",
        "Strapi",
      ],
      projectLink: null,
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/ube/9396376b9a424dc5.webp",
      blurImage:
        "data:image/webp;base64,UklGRhgBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSKAAAAANcBvbtqqc8/7HLXSNGMpxiKiMNqiBHtzdHb7hUkJETIAgb4lSMUzi7bpSroYsJnW7U/DZGvYyZTOfu7X17ZMllvRmJOjj+py3D8IVDcQ1Qyj78w2fKVt4wz+J2y/E+xtAADcA1NUXVaVZuhGvt31/DEDsJprbZrZSUa6X/WS0O5gEdq2pxet1i/N2NlrBY1laTPp10VcCATu1Q3+kuGUCVlA4IFIAAADwAwCdASoUAAwAPu1iqk2ppaQiMAgBMB2JZwAAXotmSbGkljSVH00IAMtMWwNVYOUppfOCOhpbIT7GLRXm4yXzkfyBiLnwl/LQi4/gUvttQEAA",
      role: "FULLSTACK",
      company: "Bask Digital Agency",
      teamSize: 15,
      startedAt: "2021-08-01",
      endedAt: "2023-03-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title: "Разработка fullstack-конструктора рекламных лендингов",
            description:
              "Спроектировал и разработал fullstack-конструктор рекламных лендингов с визуальным управлением контентом, переиспользуемыми блоками и обновлением превью в реальном времени. Реализовал механизм редактирования страниц без необходимости ручной разработки и публикации кода, позволив маркетинговым командам самостоятельно создавать и изменять рекламные материалы",
            metric:
              "Сократил запуск рекламных лендингов с 2 недель до нескольких часов",
          },
          {
            title:
              "Разработка системы мониторинга и аналитики рекламных кампаний",
            description:
              "Разработал систему мониторинга более 100 рекламных лендингов с интерактивными дашбордами на React. Реализовал визуализацию пользовательских сценариев, отслеживание ключевых событий и контроль статусов страниц, объединив данные о работе рекламных сайтов в едином интерфейсе. Это позволило маркетинговым командам быстрее анализировать эффективность кампаний и выявлять проблемы в пользовательских воронках",
            metric:
              "Более 100 рекламных лендингов под контролем единой аналитической системы",
          },
          {
            title: "Оптимизация архитектуры и рефакторинг приложения",
            description:
              "Провёл рефакторинг legacy-кода, декомпозировал крупные компоненты и модули, выделил повторяющуюся бизнес-логику в переиспользуемые shared-модули. Упростил структуру приложения, сократил дублирование кода и повысил удобство дальнейшего развития и поддержки платформы",
            metric: "Сократил объём дублирующегося кода в приложении на 20–25%",
          },
        ],
        category: "Enterprise Marketing-Tech Web-Platform",
        description:
          "Разработка и развитие комплексной административной платформы для управления сотнями рекламных сайтов международных брендов, включая Philip Morris International, Mars и Canon. UBE Admin объединяет инструменты управления контентом, визуального создания рекламных лендингов и аналитики пользовательского поведения. Платформа позволяет централизованно управлять сайтами и маркетинговыми кампаниями, отслеживать действия посетителей, анализировать пользовательские сценарии и контролировать состояние рекламных страниц. В рамках команды из 15 специалистов участвовал в развитии ключевых frontend и backend компонентов системы, включая конструктор лендингов и аналитические инструменты",
        name: "UBE Admin",
        shortDescription:
          "Централизованная платформа для управления сотнями рекламных сайтов, создания лендингов и анализа пользовательского поведения",
      },
      en: {
        achievements: [
          {
            title:
              "Development of a Fullstack Advertising Landing Page Builder",
            description:
              "Designed and developed a fullstack landing page builder with visual content management, reusable blocks, and real-time preview updates. Implemented a page editing workflow that eliminated the need for manual development and code deployment, enabling marketing teams to create and modify advertising pages independently",
            metric:
              "Reduced advertising landing page launch time from 2 weeks to just a few hours",
          },
          {
            title:
              "Development of a Marketing Campaign Monitoring and Analytics System",
            description:
              "Developed a monitoring system for over 100 advertising landing pages, featuring interactive React dashboards. Implemented user journey visualization, key event tracking, and page status monitoring, consolidating website performance data into a unified interface. This enabled marketing teams to analyze campaign performance faster and identify issues across user funnels",
            metric:
              "Over 100 advertising landing pages monitored through a single analytics system",
          },
          {
            title: "Application Architecture Optimization and Refactoring",
            description:
              "Refactored legacy code, decomposed large components and modules, and extracted recurring business logic into reusable shared modules. Simplified the application structure, reduced code duplication, and improved the maintainability and scalability of the platform",
            metric: "Reduced duplicated code across the application by 20–25%",
          },
        ],
        category: "Enterprise Marketing-Tech Platform / Web App",
        description:
          "Developed and maintained a comprehensive administration platform for managing hundreds of advertising websites for international brands, including Philip Morris International, Mars, and Canon. UBE Admin combines content management, visual landing page creation, and user behavior analytics. The platform enables centralized management of websites and marketing campaigns, visitor activity tracking, user journey analysis, and advertising page monitoring. As part of a 15-person development team, contributed to key frontend and backend components, including the landing page builder and analytics tools",
        name: "UBE Admin",
        shortDescription:
          "A centralized platform for managing hundreds of advertising websites, building landing pages, and analyzing user behavior",
      },
    },
  },
  {
    shared: {
      slug: "silavetra",
      stack: [
        "React",
        "TypeScript",
        "Node.js",
        "NestJS",
        "Strapi",
        "CMS",
        "Docker",
        "Webpack",
        "Redux",
        "Jest",
        "Playwright",
      ],
      projectLink: "https://silavetra.com/travel",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/silavetra/f340fa2cdda92782.webp",
      blurImage:
        "data:image/webp;base64,UklGRh4BAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSKEAAAANgFXbtrJsH9zd3eGJQRQrYJ1oQAHLwCsF3N3ll3txqRAREyCOZzN2vLxiXyvWgWtCutnhQ6FKJeKssJvyT7RBr/zKkqcrPrwaYx4xiSxXfKzQyyGU4Gu6AvQVCPgXEgB6daUrAWi4jIS3V/YvEhNQctnVMrFIIrj8/bE1NxoBlA9cY7EYVGK2m032mpBVxNmwOSCr16IQXA+DzsXl0YjYDwBWUDggVgAAAPADAJ0BKhQADAA+7WSpTamlpCIwCAEwHYlnAABe9U7mkZejzlzo/AAA/unaI1o6MtA/y+8GDejzeCQ5oQs4Oo9wCiYnI7SFazp4TRGSJyCpfBi5AAAA",
      role: "FULLSTACK",
      company: "Bask Digital Agency",
      teamSize: 15,
      startedAt: "2021-08-01",
      endedAt: "2023-03-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title:
              "Разработка комплексной системы бронирования и управления заказами",
            description:
              "Спроектировал и реализовал бизнес-логику бронирования для различных типов продуктов и услуг. Разработал механизмы управления доступностью тренировок, оформления заказов, применения скидок, промокодов и подарочных сертификатов. Реализовал полный пользовательский сценарий от выбора тренировки до подтверждения бронирования, учитывая различные условия ценообразования и программы лояльности",
            metric:
              "Единая система бронирования с поддержкой разных продуктов и инструментов лояльности",
          },
          {
            title: "Интеграция платёжных систем и обработка транзакций",
            description:
              "Интегрировал три платёжных эквайринга в приложение. Реализовал полный цикл обработки платежей, включая создание транзакций, отслеживание статусов, обработку ошибок и возвраты средств. Обеспечил согласованную работу платёжной логики с системой бронирования и автоматизировал обработку типовых платёжных сценариев",
            metric:
              "Ручные проверки платежей менеджерами сокращены примерно на 30%",
          },
          {
            title:
              "Разработка административной панели с ролевой моделью доступа",
            description:
              "Разработал административную часть платформы для управления бронированиями, клиентами, продуктами и расписанием. Реализовал гибкую систему ролей и разрешений, обеспечивающую разграничение доступа к функциям и данным в зависимости от полномочий пользователей. Адаптировал архитектуру приложения для поддержки нескольких брендов и различных бизнес-сценариев",
            metric:
              "Единая админ-панель с гибким разграничением доступа для разных ролей и брендов",
          },
        ],
        category: "Веб-приложение",
        description:
          "Разработка и развитие fullstack-платформы для бронирования яхтенных тренировок компании Sila Vetra, объединяющей клиентский сервис и административную панель управления. Пользователи могут выбирать тренировки и доступные слоты, оформлять бронирования, применять промокоды, скидки и подарочные сертификаты, а также оплачивать заказы через несколько платёжных систем. Административная панель предоставляет инструменты управления расписанием, бронированиями, клиентами и продуктами, имеет гибкую систему ролей и разграничения доступа к данным и функциям. Платформа также поддерживает мультибрендовую архитектуру, позволяющую адаптировать функциональность под бизнес-потребности разных направлений компании",
        name: "Sila Vetra Booking System",
        shortDescription:
          "Комплексная система бронирования яхтенных тренировок с управлением платежами, скидками и расписанием",
      },
      en: {
        achievements: [
          {
            title:
              "Development of a Comprehensive Booking and Order Management System",
            description:
              "Designed and implemented booking business logic for different product and service types. Developed mechanisms for managing training availability, processing reservations, and applying discounts, promo codes, and gift certificates. Built the complete user journey from session selection to booking confirmation, accounting for different pricing rules and customer loyalty programs",
            metric:
              "Unified booking system supporting multiple product types and customer loyalty features",
          },
          {
            title: "Payment Gateway Integration and Transaction Processing",
            description:
              "Integrated three payment gateways into the application. Implemented the complete payment lifecycle, including transaction creation, status tracking, error handling, and refunds. Ensured seamless integration between payment processing and booking workflows while automating routine payment management operations",
            metric:
              "Integrated 3 payment gateways and reduced manual payment checks by approximately 30%",
          },
          {
            title:
              "Development of an Administrative Panel with Role-Based Access Control",
            description:
              "Developed the administrative platform for managing bookings, customers, products, and schedules. Implemented a flexible role and permission system to control access to features and data based on user responsibilities. Adapted the application architecture to support multiple brands and different business workflows",
            metric:
              "Unified admin panel with flexible role-based access across multiple brands",
          },
        ],
        category: "Web Application",
        description:
          "Developed and maintained a fullstack booking platform for Sila Vetra, combining a customer-facing booking service with an administrative management system. Users can browse available yacht training sessions, select time slots, make reservations, apply promo codes, discounts, and gift certificates, and pay through multiple payment providers. The admin panel provides tools for managing schedules, bookings, customers, and products, featuring a flexible role-based access control system. The platform also supports a multi-brand architecture, allowing its functionality to be adapted to the business needs of different brands",
        name: "Sila Vetra Booking System",
        shortDescription:
          "A comprehensive yacht training booking platform with payment processing, discounts, customer management, and scheduling",
      },
    },
  },
  {
    shared: {
      slug: "enterprise-cms-commerce",
      stack: [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "PHP",
        "jQuery",
        "Rest API",
        "HTML",
        "CSS",
        "Component Architecture",
      ],
      projectLink: null,
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/enterprise-cms-commerce/43fd8ffb8711951b.webp",
      blurImage:
        "data:image/webp;base64,UklGRhgBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSJ8AAAANcBvbtqqc83AN3SPrxiGiMtqgB2pwd3f4hksJETEBgrzFSsUgibfrSrkaMOvl7U7CZ3PQjZTFeOnU1rdPpkjSlRFCGdfnvH0QjpA/qmhC3p9v+Ey9CX8lcPuFN7xSAwjgBoCqciMoScKouxFvd/0xAO7HqtNiNFO6SpfddLw96nTYtScmt9spzrvpaAWnaWkyqNdFX/L5rFQOg9HVqScAVlA4IFIAAAAQBACdASoUAAwAPu1iqk4ppaQiMAgBMB2JZwC7ACLMJojplACcXJgLgADynT+vqduDlk+euQGIe3DRwyZtCpo9X6R4f2sEMw/X0JqhkmNXEAAA",
      role: "FULLSTACK",
      company: "INTEC",
      teamSize: 10,
      startedAt: "2019-06-01",
      endedAt: "2021-05-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title: "Разработка визуального конструктора сайтов",
            description:
              "Участвовал в разработке визуального конструктора страниц, реализовывал механизмы сборки интерфейсов из настраиваемых UI-модулей, управления расположением элементов и настройки их отображения. Обеспечивал корректную работу различных комбинаций компонентов без нарушения структуры и визуальной целостности страниц. Решение позволяло создавать и настраивать страницы без написания кода",
            metric:
              "Создание и настройка страниц из готовых модулей без написания кода",
          },
          {
            title:
              "Разработка модульной архитектуры переиспользуемых UI-компонентов",
            description:
              "Разрабатывал настраиваемые UI модули для корпоративных сайтов и интернет магазинов, обеспечивая повторное использование компонентов и гибкость их конфигурации. Работал с frontend и backend логикой, позволяя адаптировать модули под разные бизнес требования без дублирования реализации. Общая библиотека платформы включала более 50 готовых UI блоков",
            metric:
              "Более 50 готовых UI блоков в единой библиотеке компонентов",
          },
          {
            title: "Разработка сложной логики B2B каталогов товаров",
            description:
              "Реализовывал функциональность каталогов для промышленной электронной коммерции, иерархию категорий, сложные товарные характеристики, варианты товаров и фильтрацию по атрибутам. Разрабатывал логику обработки структурированных товарных данных и их отображения, включая представление цен и складских остатков для различных конфигураций товаров",
            metric:
              "Единый каталог со сложными характеристиками, вариантами товаров и динамической фильтрацией",
          },
          {
            title: "Разработка компонентов личного кабинета B2B клиентов",
            description:
              "Разрабатывал отдельные страницы и интерфейсные компоненты корпоративного личного кабинета для управления бизнес профилями и работы с заказами. Реализовывал пользовательские сценарии с несколькими юридическими лицами в рамках одной учётной записи, а также интерфейсы просмотра заказов, статусов оплаты и доставки и других данных корпоративных клиентов",
            metric:
              "Интерфейсы для работы с несколькими компаниями в рамках одного аккаунта",
          },
        ],
        category: "Корпоративное ПО / B2B-коммерция",
        description:
          "Участвовал в разработке корпоративных CMS-решений для создания сайтов компаний и B2B-платформ электронной коммерции. Работал над frontend- и backend-модулями на JavaScript/TypeScript и PHP, разрабатывал настраиваемые UI-компоненты, инструменты визуального конструирования страниц и сложную коммерческую функциональность. Решения объединяли переиспользуемую библиотеку компонентов, гибкие механизмы сборки страниц, расширенные товарные каталоги и интерфейсы личных кабинетов корпоративных клиентов.=",
        name: "Enterprise Web Platform",
        shortDescription:
          "Комплекс корпоративных CMS-решений для создания бизнес сайтов и B2B магазинов с модульной архитектурой интерфейсов, визуальным конструктором страниц и расширенной коммерческой функциональностью",
      },
      en: {
        achievements: [
          {
            title: "Development of a Reusable Modular UI Architecture",
            description:
              "Developed configurable UI modules for corporate websites and e-commerce platforms, focusing on component reusability and flexible configuration. Worked on both frontend and backend logic, enabling modules to adapt to different business requirements without duplicating implementations. The overall platform ecosystem included a library of more than 50 ready-made UI blocks",
            metric: "50+ ready-made UI blocks in a shared component library",
          },
          {
            title: "Development of a Visual Website Builder",
            description:
              "Contributed to the development of a visual page builder, implementing mechanisms for composing interfaces from configurable UI modules, managing element layouts, and controlling component display settings. Ensured different component combinations worked without compromising page structure or visual consistency. The solution enabled users to create and customize website pages without writing code",
            metric:
              "Visual page creation and customization without writing code",
          },
          {
            title: "Engineering of Advanced B2B Product Catalogs",
            description:
              "Implemented complex catalog functionality for industrial e-commerce, including hierarchical categories, detailed product specifications, product variants, and attribute-based filtering. Developed logic for processing structured product data and displaying it, including pricing and stock availability across different product configurations",
            metric:
              "Unified catalog supporting complex specifications, product variants, and dynamic filtering",
          },
          {
            title: "Development of B2B Customer Portal Components",
            description:
              "Developed selected pages and interface components for a corporate customer portal, supporting business profile management and order-related workflows. Implemented user scenarios involving multiple legal entities within a single account, alongside interfaces for viewing orders, payment and delivery statuses, and other business customer data",
            metric:
              "Customer portal interfaces supporting multiple companies within one account",
          },
        ],
        category: "Enterprise Software / B2B Commerce",
        description:
          "Contributed to the development of enterprise CMS solutions for corporate websites and B2B e-commerce platforms. Worked across frontend and backend modules using JavaScript and PHP, building configurable UI components, visual page-building tools, and complex commerce functionality. The solutions combined a reusable component library, flexible page composition mechanisms, advanced product catalogs, and customer portal interfaces",
        name: "Enterprise Web Platform",
        shortDescription:
          "A suite of enterprise CMS solutions for corporate websites and B2B e-commerce, featuring modular UI architecture, visual page building, and advanced commerce functionality",
      },
    },
  },
  {
    shared: {
      slug: "phonebook",
      stack: [
        "React",
        "TypeScript",
        "Node.js",
        "Elysia",
        "Docker",
        "Doscker Compose",
        "Kubernetes",
        "Tailwindcss",
        "Vite",
        "Bun",
        "CI/CD",
        "Wagmi",
        "Ethers",
        "Viem",
        "Tanstack",
      ],
      projectLink: "https://phonebook.atgraphite.com",
      image:
        "https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/cases/phonebook/752e10c257c0448f.webp",
      blurImage:
        "data:image/webp;base64,UklGRggBAABXRUJQVlA4WAoAAAAQAAAAEwAACwAAQUxQSKIAAAANgF3bdoLoxnB3d7datAC6ogQaoAg+KcB95s89CQ4tRMQEiFqvGwYBgAPeh/3RAYeG+fXtgNvMauVa9j6eFG4fXJmkWavmxwH3eEsJA2UBjbstbiuoOJD7QHAAIYcHAAJISgCQewCM425CcP3wL7kgwCAcdhgFN1L9+ydflMcHYPgu7cGgxyLU+/P+3ZkPcPW/m2xpIOk3s8PHdqFjCTv//wFWUDggQAAAAJADAJ0BKhQADAA+7WaqTimlo6IwCAEwHYlnAABb6Li4kSetAAAA/ujiwogbDUD9+enkP6JOepBccj6/NzoDwAA=",
      role: "FULLSTACK",
      company: "AIPeople",
      teamSize: 22,
      startedAt: "2023-04-01",
      endedAt: "2026-09-01",
    },
    texts: {
      ru: {
        achievements: [
          {
            title: "Разработка алгоритма динамического расчёта репутации",
            description:
              "Спроектировал и реализовал алгоритм расчёта репутации телефонных номеров на основе взвешенной системы пользовательских оценок. Внедрил динамические коэффициенты, учитывающие историю голосований каждого пользователя и актуальность его оценок. Использовал сигмоидальные функции для расчёта весов, позволяющие усиливать вклад последовательных и сбалансированных участников и снижать влияние потенциально недобросовестных голосов",
            metric:
              "Динамическое взвешивание голосов с коэффициентами влияния до 10x",
          },
          {
            title: "Разработка блокчейн-системы пользовательского голосования",
            description:
              "Реализовал механизм децентрализованного голосования с хранением данных в блокчейн-смарт-контрактах. Разработал логику назначения положительной и отрицательной репутации телефонным номерам, управления голосами и повторного голосования с автоматической заменой предыдущей оценки. Интегрировал систему с криптокошельками, обеспечив подтверждение пользовательских операций через блокчейн-транзакции",
            metric:
              "Децентрализованное управление репутацией без централизованного хранения голосов",
          },
          {
            title:
              "Разработка fullstack-системы регистрации и верификации пользователей",
            description:
              "Разработал пользовательский сценарий регистрации, объединив подключение криптокошелька, оплату сетевой комиссии и подтверждение номера телефона. Реализовал механизм выдачи стартовых токенов для голосования после успешной регистрации, а также интерфейс поиска телефонных номеров и управления пользовательскими оценками. Обеспечил согласованную работу frontend и backend логики с блокчейн-инфраструктурой",
            metric:
              "Автоматизированная регистрация, верификация и выдача токенов для голосования",
          },
        ],
        category: "FinTech / Web3-приложение",
        description:
          "Спроектировал и самостоятельно разработал fullstack-приложение Phonebook - децентрализованную систему репутации телефонных номеров. Платформа позволяет пользователям находить номера, оценивать их надёжность и формировать коллективную репутацию на основе положительных и отрицательных голосов. Реализовал взаимодействие с блокчейн-смарт-контрактами для хранения данных и управления репутацией, интеграцию с криптокошельками и подтверждение телефонных номеров. В основе системы лежит алгоритм динамического взвешивания пользовательских оценок, учитывающий историю голосований и актуальность отзывов",
        name: "Phonebook",
        shortDescription:
          "Децентрализованная платформа для проверки телефонных номеров и формирования репутации на основе пользовательских оценок",
      },
      en: {
        achievements: [
          {
            title: "Development of a Dynamic Reputation Scoring Algorithm",
            description:
              "Designed and implemented a reputation algorithm based on a weighted system of user ratings. Introduced dynamic weighting factors that account for each user's voting history and the recency of their ratings. Used sigmoid functions to calculate vote weights, increasing the influence of consistent, balanced contributors while reducing the impact of potentially manipulative voting behavior",
            metric:
              "Dynamic vote weighting with influence multipliers of up to 10x",
          },
          {
            title: "Development of a Blockchain-Based Voting System",
            description:
              "Implemented a decentralized voting mechanism with data stored in blockchain smart contracts. Developed the logic for assigning positive and negative reputation scores to phone numbers, managing votes, and allowing users to change their ratings by automatically replacing previous votes. Integrated the system with crypto wallets, enabling users to authorize voting operations through blockchain transactions",
            metric:
              "Decentralized reputation management without centralized vote storage",
          },
          {
            title:
              "Development of a Fullstack User Registration and Verification System",
            description:
              "Built an end-to-end registration flow combining crypto wallet connection, network fee payment, and phone number verification. Implemented the issuance of initial voting tokens upon successful registration, along with the interface for searching phone numbers and managing user ratings. Ensured seamless interaction between frontend and backend logic and the underlying blockchain infrastructure",
            metric:
              "Automated user registration, phone verification, and voting token issuance",
          },
        ],
        category: "FinTech / Web3 App",
        description:
          "Designed and independently developed Phonebook, a fullstack decentralized phone number reputation platform. The application allows users to look up phone numbers, assess their trustworthiness, and build collective reputations through positive and negative votes. Implemented blockchain smart contract integrations for data storage and reputation management, crypto wallet connectivity, and phone number verification. At the core of the platform is a dynamic reputation algorithm that adjusts the weight of user votes based on voting history and rating recency",
        name: "Phonebook",
        shortDescription:
          "A decentralized platform for identifying phone numbers and building reputation through community-driven ratings",
      },
    },
  },
];

export const getCaseList = (locale: Locale): Schemas["CaseListItemDto"][] =>
  cases.map(({ shared, texts }) => ({
    slug: shared.slug,
    locale,
    name: texts[locale].name,
    category: texts[locale].category,
    projectLink: shared.projectLink,
    stack: shared.stack,
    shortDescription: texts[locale].shortDescription,
    image: shared.image,
    blurImage: shared.blurImage,
  }));

export const findCase = (slug: string, locale: Locale): Detail | undefined => {
  const found = cases.find(({ shared }) => shared.slug === slug);

  return found && { ...found.shared, ...found.texts[locale], locale };
};
