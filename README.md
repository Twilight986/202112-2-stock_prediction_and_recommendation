# Stock Market Analysis Dashboard
 A web-based financial data visualization tool built with React and Ant Design, analyzing historical market data from Yahoo Finance. This project demonstrates the integration of financial APIs, data processing, and modern web development technologies.

## Features
1. Interactive dashboard built with React and Ant Design components
2. Historical stock data visualization from Yahoo Finance (3-year timeframe)
3. Multi-stock comparison capability (up to 5 stocks)
4. Technical indicators and trend analysis
5. Custom stock watchlist functionality

## Tech Stack
1. Tech Stack
2. Frontend: React, Ant Design
3. Data Source: Yahoo Finance API
4. Data Analysis: Python

## Quick Start

**Debug on your own machine:**

1. Guarantee node version 5.3+, npm version 3.3+
2. After `git clone`, enter `npm instal` in the terminal under the file path and install the necessary dependencies
3. `npm run dev`
4. `start webpack-dev-server`
5. open the browser "http://localhost:8080" to view the effect. The default is debug mode, no back-end interface will be requested, all data is mock, related configuration see src/config.js
6. If necessary, you can set logLevel to debug (see src/config.js), and a detailed debug log will be output, which can be seen by opening the chrome console.
7. Refer to src/menu.js, configure the sidebar and top menu according to your needs
8. Modify the routing table in src/index.js to ensure that it is consistent with the menu item in menu.js, otherwise it may be 404
9. If you want to use the DBTable component, refer to the example under src/schema and write your own querySchema and dataSchema files. When configuring the DBTable component in the routing table, the table name should be passed in as props, similar to <Route path="option1" tableName="test" component={DBTable}/>.
10. Modify the relevant configuration in src/config.js, such as project name, footer, single sign-on, etc.
11. `npm run prod`, compile the js file, and then copy all the js/css/html files in the dist directory to your own project, and the front-end work is completed. 
12. Generally, there will be an index.html, a bundle.min.css, and multiple js files, depending on whether dynamic routing is used.
13. Start your web service and visit index.html to view the effect.
14. The username and password are both "guest"

**Some other commands:**

```shell
npm run eslint
npm run stylelint
npm run lesshint
```

**some lint tools**

```shell
npm run clean
delete bundle*.js 
```

### Back End

#### Teck Stack

- SpringBoot == 1.4.1
- MyBatis
- JDBC

**The file structure for backend:**

```xml
│  LICENSE
│  pom.xml
│  spring-stocks.iml
│
├─.idea
│  │  .gitignore
│  │  .name
│  │  compiler.xml
│  │  dataSources.local.xml
│  │  dataSources.xml
│  │  encodings.xml
│  │  jarRepositories.xml
│  │  junitgenerator-prj-settings.xml
│  │  misc.xml
│  │  modules.xml
│  │  uiDesigner.xml
│  │  workspace.xml
│  │
│  ├─dataSources
│  │  │  2fc90a4f-344e-4d2a-bc1e-d55ff2f20e40.xml
│  │  │
│  │  └─2fc90a4f-344e-4d2a-bc1e-d55ff2f20e40
│  │      └─storage_v2
│  │          └─_src_
│  │              └─schema
│  │                      db_book_midterm.f4lURA.meta
│  │                      db_book_midterm.f4lURA.zip
│  │                      f21w4111midterm.hScHqA.meta
│  │                      f21w4111midterm.hScHqA.zip
│  │                      information_schema.FNRwLQ.meta
│  │                      lahmansbaseballdb.OgQEpQ.meta
│  │                      lahmansbaseballdb.OgQEpQ.zip
│  │                      sys.zb4BAA.meta
│  │                      sys.zb4BAA.zip
│  │
│  └─libraries
│          Maven__antlr_antlr_2_7_7.xml
│          Maven__ch_qos_logback_logback_classic_1_1_7.xml
│          Maven__ch_qos_logback_logback_core_1_1_7.xml
│          Maven__com_fasterxml_classmate_1_3_1.xml
│          Maven__com_fasterxml_jackson_core_jackson_annotations_2_8_3.xml
│          Maven__com_fasterxml_jackson_core_jackson_core_2_8_3.xml
│          Maven__com_fasterxml_jackson_core_jackson_databind_2_8_3.xml
│          Maven__com_google_protobuf_protobuf_java_3_11_4.xml
│          Maven__com_jayway_jsonpath_json_path_2_2_0.xml
│          Maven__dom4j_dom4j_1_6_1.xml
│          Maven__javax_transaction_javax_transaction_api_1_2.xml
│          Maven__javax_validation_validation_api_1_1_0_Final.xml
│          Maven__junit_junit_4_12.xml
│          Maven__mysql_mysql_connector_java_8_0_21.xml
│          Maven__net_minidev_accessors_smart_1_1.xml
│          Maven__net_minidev_json_smart_2_2_1.xml
│          Maven__nz_net_ultraq_thymeleaf_thymeleaf_layout_dialect_1_4_0.xml
│          Maven__ognl_ognl_3_0_8.xml
│          Maven__org_apache_commons_commons_csv_1_1.xml
│          Maven__org_apache_tomcat_embed_tomcat_embed_core_8_5_5.xml
│          Maven__org_apache_tomcat_embed_tomcat_embed_el_8_5_5.xml
│          Maven__org_apache_tomcat_embed_tomcat_embed_websocket_8_5_5.xml
│          Maven__org_apache_tomcat_tomcat_jdbc_8_5_5.xml
│          Maven__org_apache_tomcat_tomcat_juli_8_5_5.xml
│          Maven__org_apiguardian_apiguardian_api_1_1_2.xml
│          Maven__org_aspectj_aspectjweaver_1_8_9.xml
│          Maven__org_assertj_assertj_core_2_5_0.xml
│          Maven__org_codehaus_groovy_groovy_2_4_7.xml
│          Maven__org_hamcrest_hamcrest_core_1_3.xml
│          Maven__org_hamcrest_hamcrest_library_1_3.xml
│          Maven__org_hibernate_common_hibernate_commons_annotations_5_0_1_Final.xml
│          Maven__org_hibernate_hibernate_core_5_0_11_Final.xml
│          Maven__org_hibernate_hibernate_entitymanager_5_0_11_Final.xml
│          Maven__org_hibernate_hibernate_validator_5_2_4_Final.xml
│          Maven__org_hibernate_javax_persistence_hibernate_jpa_2_1_api_1_0_0_Final.xml
│          Maven__org_javassist_javassist_3_20_0_GA.xml
│          Maven__org_jboss_jandex_2_0_0_Final.xml
│          Maven__org_jboss_logging_jboss_logging_3_3_0_Final.xml
│          Maven__org_json_json_20140107.xml
│          Maven__org_junit_jupiter_junit_jupiter_5_8_2.xml
│          Maven__org_junit_jupiter_junit_jupiter_api_5_8_2.xml
│          Maven__org_junit_jupiter_junit_jupiter_engine_5_8_2.xml
│          Maven__org_junit_jupiter_junit_jupiter_params_5_8_2.xml
│          Maven__org_junit_platform_junit_platform_commons_1_8_2.xml
│          Maven__org_junit_platform_junit_platform_engine_1_8_2.xml
│          Maven__org_mockito_mockito_core_1_10_19.xml
│          Maven__org_objenesis_objenesis_2_1.xml
│          Maven__org_opentest4j_opentest4j_1_2_0.xml
│          Maven__org_ow2_asm_asm_5_0_3.xml
│          Maven__org_skyscreamer_jsonassert_1_3_0.xml
│          Maven__org_slf4j_jcl_over_slf4j_1_7_21.xml
│          Maven__org_slf4j_jul_to_slf4j_1_7_21.xml
│          Maven__org_slf4j_log4j_over_slf4j_1_7_21.xml
│          Maven__org_slf4j_slf4j_api_1_7_21.xml
│          Maven__org_springframework_boot_spring_boot_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_autoconfigure_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_aop_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_data_jpa_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_jdbc_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_logging_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_test_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_thymeleaf_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_tomcat_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_starter_web_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_test_1_4_1_RELEASE.xml
│          Maven__org_springframework_boot_spring_boot_test_autoconfigure_1_4_1_RELEASE.xml
│          Maven__org_springframework_data_spring_data_commons_1_12_3_RELEASE.xml
│          Maven__org_springframework_data_spring_data_jpa_1_10_3_RELEASE.xml
│          Maven__org_springframework_security_spring_security_crypto_4_1_3_RELEASE.xml
│          Maven__org_springframework_spring_aop_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_aspects_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_beans_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_context_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_core_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_expression_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_jdbc_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_orm_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_test_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_tx_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_webmvc_4_3_3_RELEASE.xml
│          Maven__org_springframework_spring_web_4_3_3_RELEASE.xml
│          Maven__org_thymeleaf_thymeleaf_2_1_5_RELEASE.xml
│          Maven__org_thymeleaf_thymeleaf_spring4_2_1_5_RELEASE.xml
│          Maven__org_unbescape_unbescape_1_1_0_RELEASE.xml
│          Maven__org_yaml_snakeyaml_1_17.xml
│          Maven__xml_apis_xml_apis_1_4_01.xml
│
├─src
│  └─main
│      ├─java
│      │  └─org
│      │      └─launchcode
│      │          └─stocks
│      │              │  AuthenticationInterceptor.java
│      │              │  StocksApplication.java
│      │              │  WebApplicationConfig.java
│      │              │
│      │              ├─controllers
│      │              │      AbstractController.java
│      │              │      AuthenticationController.java
│      │              │      PortfolioController.java
│      │              │      StockController.java
│      │              │      StockHistoryController.java
│      │              │
│      │              ├─dao
│      │              │      AAPLDao.java
│      │              │      ARIAMDao.java
│      │              │      KODao.java
│      │              │      NVDADao.java
│      │              │      PFEDao.java
│      │              │      StockHoldingDao.java
│      │              │      StockTransactionDao.java
│      │              │      TLSADao.java
│      │              │      UserDao.java
│      │              │
│      │              ├─models
│      │              │  │  AbstractEntity.java
│      │              │  │  Stock.java
│      │              │  │  StockHistoryAbstract.java
│      │              │  │  StockHolding.java
│      │              │  │  StockLookupException.java
│      │              │  │  StockTransaction.java
│      │              │  │  User.java
│      │              │  │
│      │              │  └─domain
│      │              │          AAPL.java
│      │              │          ARIAM.java
│      │              │          KO.java
│      │              │          NVDA.java
│      │              │          PFE.java
│      │              │          TLSA.java
│      │              │
│      │              ├─service
│      │              │  │  AAPLService.java
│      │              │  │  ARIAMPredService.java
│      │              │  │  KOService.java
│      │              │  │  NVDAService.java
│      │              │  │  PFEService.java
│      │              │  │  StockHistoryService.java
│      │              │  │  TLSAService.java
│      │              │  │
│      │              │  └─impl
│      │              │          AAPLImpl.java
│      │              │          ARIAMPredImpl.java
│      │              │          KOImpl.java
│      │              │          NVDAImpl.java
│      │              │          PFEImpl.java
│      │              │          TLSAImpl.java
│      │              │
│      │              └─util
│      │                      Constant.java
│      │                      ExceptionSender.java
│      │                      GetWeek.java
│      │                      PasswordHash.java
│      │
│      └─resources
│          │  application.properties
│          │
│          ├─mapper
│          │      AAPLDao.xml
│          │      ARIAMDao.xml
│          │      KODao.xml
│          │      NVDADao.xml
│          │      PFEDao.xml
│          │      TLSADao.xml
│          │
│          ├─static
│          │  ├─css
│          │  │      bootstrap-theme.css
│          │  │      bootstrap-theme.css.map
│          │  │      bootstrap-theme.min.css
│          │  │      bootstrap.css
│          │  │      bootstrap.css.map
│          │  │      bootstrap.min.css
│          │  │      styles.css
│          │  │
│          │  ├─fonts
│          │  │      glyphicons-halflings-regular.eot
│          │  │      glyphicons-halflings-regular.svg
│          │  │      glyphicons-halflings-regular.ttf
│          │  │      glyphicons-halflings-regular.woff
│          │  │
│          │  ├─img
│          │  │      construction.gif
│          │  │      logo.png
│          │  │
│          │  └─js
│          │          bootstrap.js
│          │          bootstrap.min.js
│          │          jquery-1.11.1.js
│          │          jquery-1.11.1.min.js
│          │          jquery-1.11.1.min.map
│          │          scripts.js
│          │
│          └─templates
│                  error.html
│                  index.html
│                  login.html
│                  portfolio.html
│                  quote_display.html
│                  quote_form.html
│                  register.html
│                  template.html
│                  transaction_confirm.html
│                  transaction_form.html
│
└─target
    │  spring-stocks-0.0.1-SNAPSHOT.jar
    │  spring-stocks-0.0.1-SNAPSHOT.jar.original
    │
    ├─classes
    │  │  application.properties
    │  │
    │  ├─mapper
    │  │      AAPLDao.xml
    │  │
    │  ├─static
    │  │  ├─css
    │  │  │      bootstrap-theme.css
    │  │  │      bootstrap-theme.css.map
    │  │  │      bootstrap-theme.min.css
    │  │  │      bootstrap.css
    │  │  │      bootstrap.css.map
    │  │  │      bootstrap.min.css
    │  │  │      styles.css
    │  │  │
    │  │  ├─fonts
    │  │  │      glyphicons-halflings-regular.eot
    │  │  │      glyphicons-halflings-regular.svg
    │  │  │      glyphicons-halflings-regular.ttf
    │  │  │      glyphicons-halflings-regular.woff
    │  │  │
    │  │  ├─img
    │  │  │      construction.gif
    │  │  │      logo.png
    │  │  │
    │  │  └─js
    │  │          bootstrap.js
    │  │          bootstrap.min.js
    │  │          jquery-1.11.1.js
    │  │          jquery-1.11.1.min.js
    │  │          jquery-1.11.1.min.map
    │  │          scripts.js
    │  │
    │  └─templates
    │          error.html
    │          index.html
    │          login.html
    │          portfolio.html
    │          quote_display.html
    │          quote_form.html
    │          register.html
    │          template.html
    │          transaction_confirm.html
    │          transaction_form.html
    │
    ├─generated-sources
    │  └─annotations
    ├─maven-archiver
    │      pom.properties
    │
    └─maven-status
        └─maven-compiler-plugin
            └─compile
                └─default-compile
                        createdFiles.lst
                        inputFiles.lst
```

