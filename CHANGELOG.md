## [2.18.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.18.0...v2.18.1) (2024-02-23)


### Bug Fixes

* enable register as cvl team member and ask them on mobilizations. [#1606](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1606) [#1607](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1607) ([60cb648](https://gitlab.com/24-heures-insa/overbookd-mono/commit/60cb648e85db21a688d452ddbaa63e920457b409))
* **festival-event:** Prevent event filters from expanding vertically [#1605](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1605) ([5aac7c9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5aac7c99f79f72a496734592e5cb01f6deaf3797))
* **personal-account:** correct plural forms of consuption messages [#1585](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1585) ([3c9a9b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3c9a9b81c80d87651561ab5d1162d4abe3e95839))


### Pre-Features

* **registration:** basic setup of the new page for volunteers registration and reorganization [#1574](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1574) ([833c675](https://gitlab.com/24-heures-insa/overbookd-mono/commit/833c675297d454afe548c3defad6fdb14b668b00))

## [2.18.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.17.0...v2.18.0) (2024-02-22)


### Features

* **festival-task:** add reviewers filter. [#1589](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1589) ([2a0e804](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2a0e8042ded668a781fc15480287f4e165d8fb26))
* **festival-task:** enable reject. [#1586](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1586) ([b480829](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b480829890850fc1dadb34bbe41ff0db30afb640))


### Bug Fixes

* **festival-activity:** hide deleted linked festival tasks [#1597](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1597) ([67bda90](https://gitlab.com/24-heures-insa/overbookd-mono/commit/67bda90ba920138e2515740289750b44060b72e6))
* **festival-task:** add in review status in filter [#1599](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1599) ([6e5a6b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6e5a6b8fc086c5219dd301c4dde8ce50ab609617))
* **festival-task:** filter on task status. [#1600](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1600) ([e25380e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e25380e949c77212000ab087f98c124855f80927))


### Pre-Features

* **festival-event:** allow ask for review on refused tasks. [#1595](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1595) ([c8be005](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c8be005a30365b9d846cc60779ea5157ba43f539))

## [2.17.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.5...v2.17.0) (2024-02-21)


### Features

* **festival-task:** implement ask for review in web [#1583](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1583) ([f130b7c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f130b7c68ff5702b43c95bf348720799c4c31ee2))


### Bug Fixes

* **api:** dto definition. [#1588](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1588) ([7aa1c25](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7aa1c252ef47f9e002b657fde6d36ff81a8009a1))
* **festival-task:** display reviewers color in list [#1586](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1586) ([ab43939](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab43939461dd7e1fd1b31e460647ea61275cf3b3))
* **planning:** display mobilzations user is part of on it calendar. [#1572](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1572) ([baadbab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/baadbab5c1d9bd4d43b80cbeb7bd17ba0bc86530))


### Pre-Features

* **festival-task:** implement ask-for-review in api [#1580](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1580) ([acfe6a5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/acfe6a53b7b9176e527f231e6cb4c095f0edf5b9))

## [2.16.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.4...v2.16.5) (2024-02-18)


### Bug Fixes

* **festival-task:** :lipstick: update overflow to make sidebar scrollable ([a5e6e31](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a5e6e3141b1801fd468a65e6ab427b17c534c278))
* **festival-task:** limit mobilizable teams in UI [#1576](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1576) ([6e3eb9f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6e3eb9fcdbe062349949a9bb29068c0bbd345b3e))
* **web:** slugify tam name on search [#1578](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1578) ([33b683a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/33b683a198f0b37a3066c4ec48bbe8363fc9b3b8))


### Pre-Features

* **festival-task:** assign humain reviewer on reviewing task. [#1577](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1577) ([9be1ca4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9be1ca49edf266b7973ed3e5f5ff2345a3717492))
* **festival-task:** enable update on task under review [#1573](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1573) ([095a7a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/095a7a27e5dce38fb0e2719ef9a05d5d17797b79))


### Refactor

* **fa:** :fire: remove reference to old fa store ([97362df](https://gitlab.com/24-heures-insa/overbookd-mono/commit/97362df3cdbf9e9bdce08107bb28d8c91adf56f2))

## [2.16.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.3...v2.16.4) (2024-02-18)


### Bug Fixes

* **logistic-dashboard:** open detail card when click on graph. [#1566](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1566) ([728d4d3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/728d4d3c578bd3c7873614218bfbf2eca2853f75))
* **logistic-dashboard:** repair the filters on the page [#1525](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1525) ([db4fcdc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db4fcdcc6c18f9f8953e903e9b213db9c01d5ab6))
* **volunteer-availability:** stay on latest period. [#1567](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1567) ([ce0a0e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce0a0e5c92744ce0474316017831561d16f1edb6))
* **web:** use native step on date picker to increment minutes by fifteen minutes. [#1569](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1569) ([d8515b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d8515b9a98f4b0e3d55ec3b4f05ed83a7aef1248))


### Pre-Features

* **festival-task:** enable ask for review. [#1565](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1565) ([32f35d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/32f35d250998293553da2dd2ab1f30fc1cd9bec4))


### CI/CD

* **renovate:** :construction_worker: unset versionning globaly ([2dc3620](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2dc36202647a3c6e74a77f9c51b5366ca281c35a)), closes [/github.com/renovatebot/renovate/discussions/26877#discussioncomment-8278988](https://gitlab.com/24-heures-insa//github.com/renovatebot/renovate/discussions/26877/issues/discussioncomment-8278988)

## [2.16.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.2...v2.16.3) (2024-02-15)


### Bug Fixes

* **festival-task:** display stats. [#1561](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1561) ([ce31ecc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce31ecc2e5094116a160532725fbfdccdf1ae241))
* **festival-task:** display volunteers requested dashboard. [#1562](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1562) ([8869c9b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8869c9beb7b0eff590ab23ea95d7b032d69ad90f))
* **inventory:** delete all previous records on reset. [#1563](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1563) ([b6a89b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b6a89b9b8a9b553fa404e30239bdfcf2c3d3ebe6))
* **inventory:** parse quantities from the body. [#1563](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1563) ([4137ada](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4137adad2dda5782eb78f382b95fa1529bc55197))


### Pre-Features

* **festival-task:** add reviewable type [#1558](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1558) ([7b11f85](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7b11f852c8eacd1c985ac2ee5bf7698a4a031f6e))

## [2.16.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.1...v2.16.2) (2024-02-13)


### Bug Fixes

* **logistic-dashboard:** return requested gears. [#1560](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1560) ([f141fb6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f141fb6c5d045126a48f0f82b31dbcdb4bf9e70f))

## [2.16.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.16.0...v2.16.1) (2024-02-13)


### Bug Fixes

* **availabilities:** refresh in volunteer list [#1545](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1545) ([15b2645](https://gitlab.com/24-heures-insa/overbookd-mono/commit/15b2645765bb177b78b706552e96c326fa105a9f))
* **logistic-dashboard:** use not deleted fa & ft [#1559](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1559) ([e6e658f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e6e658f83cabc2d780fb16fed2fbf8a89cccf2c2))
* **volunteer-availabilities:** expose availabilities aggregate. [#1543](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1543) ([e639c0d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e639c0d056a939c152839b3a820a7bbddbb60a88))
* **volunteer-availability:** keep current charisma. [#1549](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1549) ([c008963](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c0089630f42f48f6be90ba6ba5977bda720dd9de))
* **volunteer-availability:** use availabilities aggregate on web. [#1543](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1543) ([f4f319e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f4f319e281a7a143ce02d06b95825571a9d9272a))


### Pre-Features

* **festival-task:** add volunteer availability conflict [#1535](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1535) ([b0d5039](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0d503951fd3865dcc5cc4d80a7b24f0efae723e))
* **festival-task:** enable mobiliation update [#1548](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1548) ([6770adf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6770adfa503c29bb04e29c58c992c67ed1be816f))


### Refactor

* **festival-task:** add in charge instructions toggle [#1557](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1557) ([eacc4ea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eacc4ea095ea5114db63d4c3dcce68ee2c856d32))

## [2.16.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.5...v2.16.0) (2024-02-11)


### Features

* **festival-task:** implement feedbacks [#1545](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1545) ([6151739](https://gitlab.com/24-heures-insa/overbookd-mono/commit/61517393abe4145002ea799ecf2a2c336d963359))
* **festival-task:** indicate when volunteers are also requested on other task. [#1534](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1534) ([8d27afe](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8d27afe96892e6a74a9b96a5c98c252dc91da169))


### Bug Fixes

* **festival-task:** indicate activity does request water or electricity supply. [#1536](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1536) ([209d5bb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/209d5bb005f257aa737544aa9934ab8e57577286))
* **festival-task:** quantity displayed for fa consumable [#1522](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1522) ([aa15aa5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa15aa55399a93e799b886e97931b368d9a30b8f))
* **logistic-dashboard:** display gear details in tooltip [#1532](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1532) ([21fe257](https://gitlab.com/24-heures-insa/overbookd-mono/commit/21fe2579547d5cfe9e7e055e6fecff57c2cb0ae1))
* update authors' surnames. [#1541](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1541) ([23b5bc8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/23b5bc87b0568ce1dbabbe509d44a8e536f9ee89))


### Refactor

* **dashboard-logisctic:** implement festival tasks [#1547](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1547) ([edafa03](https://gitlab.com/24-heures-insa/overbookd-mono/commit/edafa031a6053634a1f6823752fd5ff13a43cf86))
* **festival-activity:** display child festival tasks [#1533](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1533) ([dfbc8aa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dfbc8aa435e404ed5231ceb986dc81ea4373dcee))
* **festival-task:** display volunteer conflicts in web [#1546](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1546) ([f5eee40](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f5eee4053f8edd990b575b5eac2b0e72256c6307))
* **festival-task:** use options on mobilization type. [#1544](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1544) ([5ab3325](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5ab3325d78098e66c34418233d39fc02b8dab4c2))
* **volunteer-availability:** keep merged periods on orchestrator. [#1542](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1542) ([8fec90a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8fec90a4e3c51e71875a819b6cc025794d2172b5))

## [2.15.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.4...v2.15.5) (2024-02-07)


### Bug Fixes

* **festival-task:** indicate festival-activity location. [#1537](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1537) ([6b42c4e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6b42c4e770493988677203a2830debafb2a85197))
* **festival-task:** page available on mobile [#1421](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1421) ([fd7d35a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd7d35a40ef527e3af12269190ee3e6b10788077))


### Refactor

* **sg:** default stick price to 60 cents [#1538](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1538) ([297e105](https://gitlab.com/24-heures-insa/overbookd-mono/commit/297e105779c15fc59b96cdcebbbe46e994a4904a))

## [2.15.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.3...v2.15.4) (2024-02-06)


### Bug Fixes

* **festival-task:** add inquiry [#1529](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1529) ([1f9f422](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1f9f4225f342f4a815860dacb4f639172259102e))
* **festival-task:** add volunteers & teams to existing mobilization [#1530](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1530) ([1ba9c6c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1ba9c6cbd18545cb34f2c833cc81daedcc4930d8))
* **festival-task:** remove volunteer from mobilization [#1531](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1531) ([47f78fc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/47f78fca857969e81d271d0fe8538a22e793959f))
* **volunteer-availability:** remove availability and select entire day. [#1512](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1512) ([6ffef9f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6ffef9ff32c2c5c1bc34b6b5dbc8cc6e85fbaa93))


### Pre-Features

* **festival-task:** complete mobilization for creation [#1509](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1509) ([ef0d4a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef0d4a1c89dcec0859a3e55b0d565ae198624423))

## [2.15.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.2...v2.15.3) (2024-02-05)


### Bug Fixes

* **personal-account:** add transfer limit [#1527](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1527) ([571f71c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/571f71c22120d34c04c3bc135fa5b18d60081de2))

## [2.15.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.1...v2.15.2) (2024-02-04)


### Bug Fixes

* **logistic-dashboard:** add the possibility to chose the date window [#1524](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1524) ([bbf3c34](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bbf3c3495182f07b9ac6b3d4ce4046dbc2e18fce))
* **personal-account:** CP overflow [#1526](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1526) ([acab842](https://gitlab.com/24-heures-insa/overbookd-mono/commit/acab8428ee312cc79f9b12ef79a66742b8349ae9))


### Refactor

* **festival-task:** rename instructions for more clarity [#1523](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1523) ([7bc582f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7bc582f3eaa4b9a4bd328abbbe5fa23a15edff06))


### CI/CD

* **renovate:** 🏗 set docker versioning ([b037620](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0376202c30b70c6b21ac78712c2e0b2552e141d))

## [2.15.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.15.0...v2.15.1) (2024-01-27)


### Pre-Features

* **festival-task:** add filter on listing. [#1516](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1516) ([cf057f2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cf057f202e752002b10a56d69cfa6e315ade0910))
* **festival-task:** show ponctual usage gear [#1519](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1519) ([971bfc3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/971bfc325d538d5a88c2fffca7961cafae70fc2c))


### CI/CD

* **renovate:** set datasource to docker for docker dependancies ([02635d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/02635d9fdcbd7e5f40a9d81eddeaa7bdefa6cc16))

## [2.15.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.14.1...v2.15.0) (2024-01-26)


### Features

* **dashboard:** change details table into a graph ([acb0f1e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/acb0f1ebbf9dc334c0856dc565b78763a2a31009))


### Bug Fixes

* **festival-task:** order preview list on id. [#1506](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1506) ([8ce343b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8ce343ba8ae4ac9756574077b46ddd8a5730975e))
* **volunteer-availability:** store availabilities date at Paris timezone. [#1058](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1058) ([960f80f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/960f80f9e53824dc4ffce27b2800c045a531b0b0))
* **web:** availability pages. [#1514](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1514) ([f6c191f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f6c191f937f82e9564737ac65460aeefaafb74e1))


### Pre-Features

* **fesitval-task:** add parent fa component [#1487](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1487) ([3e7f76d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3e7f76d49a3febbac91aa295cf03d9be30b3260c))
* **festival-task:** add & remove contact in api [#1497](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1497) ([3f57ff8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f57ff827916e6f46a17aaa72c5e9484c5688e21))
* **festival-task:** add & remove in charge volunteer in api [#1498](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1498) ([c801ba8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c801ba833fdd58a0d9bbc78c0f40dbf07fb6b1d5))
* **festival-task:** add requests to update mobilization [#1502](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1502) ([43dd033](https://gitlab.com/24-heures-insa/overbookd-mono/commit/43dd033db32805ddf265bd8bcebee85aee5aefaf))
* **festival-task:** enable remove team from mobilization. [#1495](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1495) ([7ac6e90](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7ac6e90008cb1b697a467f141b33528e2049eec1))
* **festival-task:** enable remove volunteer from mobilization. [#1494](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1494) ([b26f9dc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b26f9dc05b1bd442f1e1eec35a220d6b6714d83b))
* **festival-task:** enable update on mobilization. [#1501](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1501) ([2ca00ec](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2ca00ecc87fb8cde6e5159d4850fd9754fe8f840))
* **festival-task:** implement base mobilization in web [#1505](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1505) ([e0eae2a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e0eae2ac9317fed75a6c5a014e7405d53e8519cf))
* **festival-task:** implement in charge volunteers and contacts in web [#1503](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1503) ([3d1e3f7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3d1e3f7281e039a6f61bec7466d82634a5051251))
* **festival-task:** implement inquiries in api [#1500](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1500) ([52e7714](https://gitlab.com/24-heures-insa/overbookd-mono/commit/52e7714b4389074f4fb4f67689bb1395e3d56519))
* **festival-task:** implement inquiries in web [#1504](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1504) ([1f2199b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1f2199bd444b283d4e3900742a99eada046fcf0f))
* **festival-task:** implement mobilizations in api [#1499](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1499) ([1712425](https://gitlab.com/24-heures-insa/overbookd-mono/commit/17124250c171c91e1f27dde8bb3067973531b50a))
* **festival-task:** return history from api [#1496](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1496) ([d4e4853](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d4e485398fc08ffd3b4540877bc0a8ee360f9810))


### Refactor

* **dashboard:** change expansion panels into a data table [#1482](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1482) ([601c790](https://gitlab.com/24-heures-insa/overbookd-mono/commit/601c7906c24c55bd7a32ad600851aaa72e0561a3))
* **festival-task:** sections order [#1510](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1510) ([bec540d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bec540d97a919e445108a12a8ba49d6b99c526a0))
* **volunteer-availability:** add hour type. [#1058](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1058) ([54a55db](https://gitlab.com/24-heures-insa/overbookd-mono/commit/54a55db6343e81666e40abed01914b05c38424ca))

## [2.14.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.14.0...v2.14.1) (2024-01-23)


### Bug Fixes

* **festival-activity:** find gears according to slug in web. [#1480](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1480) ([8501a63](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8501a63c87a832ae485b8df8d4cdb07051bd4f2b))
* **trombinoscope:** enable on mobile. [#1481](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1481) ([fe049bf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fe049bf9aadfa45b288db5d593b1e3f48d9cd44a))


### Pre-Features

* **festival-task:** add creation & basic update [#1472](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1472) ([b02b0e3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b02b0e3a7e79246bc804ae4b33bed2fe777da274))
* **festival-task:** add creation logs [#1489](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1489) ([0b89e54](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0b89e549a85cacbceb5be3699d325b7a05ca59d5))
* **festival-task:** add general section in web & api [#1485](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1485) ([0587e84](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0587e84e18248f6c8b6a355f3edb4456d583f1c2))
* **festival-task:** add instructions section request [#1486](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1486) ([17df120](https://gitlab.com/24-heures-insa/overbookd-mono/commit/17df120d22068dac112df9c2524574e4ee2b622b))
* **festival-task:** allow remove contact. [#1490](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1490) ([6709c07](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6709c07b60942b2375b9bc5f03b5c8bc6c8265e6))
* **festival-task:** enable add inquiry. [#1467](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1467) ([03ea58d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/03ea58d248a7db5ce33408937642cc4e945f66e4))
* **festival-task:** enable add team to mobilization. [#1479](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1479) ([1fc0e3d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1fc0e3d124dcf8292668065e33d7e1f4b6d5cbe2))
* **festival-task:** enable add volunteer to mobilization. [#1479](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1479) ([a6e2374](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a6e237438ce0b4a5b45f49587e42bba64359322c))
* **festival-task:** enable remove in charge volunteers. [#1491](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1491) ([4aa8c4e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4aa8c4e48eaf58556cd26d83b35bbf0162d55949))
* **festival-task:** enable remove inquiries. [#1493](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1493) ([f7096a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f7096a3d65b7430ee5fc8945e60136c2b2f64cfb))
* **festival-task:** enable remove mobilizations. [#1492](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1492) ([600647d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/600647d27272487e010a82f1c678edf775638aec))
* **festival-task:** implement new FT in web for creation [#1483](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1483) ([f395c24](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f395c24c3f77751c0628ca9a1384f867b61816b3))
* **festival-task:** show ft lists [#1484](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1484) ([2bdca63](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2bdca6354d2680e2ac57738e712ee9c3bea301ff))

## [2.14.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.7...v2.14.0) (2024-01-19)


### Features

* **web:** create GearFilter and add it to recap-matos. [#1422](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1422) ([0ea3d45](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0ea3d4561159f3def0c9643a0bf7bcee80bcf6c4))


### Bug Fixes

* **mail:** fa validation mistake [#1465](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1465) ([2e5a2bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2e5a2bdd60f443774ac2ee21529b24c3fe10245f))
* **trombinoscope:** add profile picture missing alert. [#1336](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1336) ([056fba3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/056fba32f212bc5d9f3407c5eada150f74ccdcf9))
* **trombinoscope:** group volunteers. [#1337](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1337) ([90707eb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/90707eb785146984c270d4f47bfd9b3132291694))


### Pre-Features

* **festival-task:** create api template & db table ([e6cd136](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e6cd1364f7fa5f2cea6e8994ad1cf10ddf4f0aa5))
* **logistic-dashboard:** implement API in WEB, renaming and organising [#1446](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1446) ([0eb88c5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0eb88c569b51c58ccfde93764ebb0e1d41e82d54))

## [2.13.7](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.6...v2.13.7) (2024-01-18)


### Bug Fixes

* **trombinoscope:** display volunteers' profile picture and remove comment. [#1418](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1418) ([08ba3c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/08ba3c05842e083c49112df8142671f9f420b798))


### Pre-Features

* **festival-task:** allow add mobilization. [#1466](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1466) ([8336b18](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8336b18d909e142c8b2d38c548411255fca04095))

## [2.13.6](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.5...v2.13.6) (2024-01-17)


### Bug Fixes

* **festival-activity:** change electricity supply id expected type from number to string in controller. [#1473](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1473) ([1d2b02d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1d2b02d1d4dea4bcbbc8895f16111d99aee02a3c))

## [2.13.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.4...v2.13.5) (2024-01-16)


### Bug Fixes

* **festival-event:** allow to init inquiry section when only not impacted reviewers already approved. [#1469](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1469) ([cf9df7a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cf9df7a5af40ff6018f14c81ff23014dc245e66e))
* **registration:** register with lower case email. [#1282](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1282) ([f295710](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f2957109e2214096ac4c46bc440ae08dd7f214a6))


### Pre-Features

* **festival-event:** add festival-task and share structures into common. [#1455](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1455) ([7e45584](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7e455848fa3e12714c25b93944b8b674104a1433))
* **festival-task:** add contacts and in charge volunteers. [#1465](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1465) ([4b1cb31](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4b1cb3119699662889ad6df330f68c168743cde3))
* **festival-task:** enable view task's previews and details. [#1460](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1460) ([d16a8c5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d16a8c520e6d615c3047b230d261b352471ea22e))
* **festival-task:** update general and instructions section. [#1461](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1461) ([3bc9f5e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3bc9f5e211b81772f2293439cbc2a56e1af7b0e4))

## [2.13.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.3...v2.13.4) (2024-01-14)


### Bug Fixes

* **festival-activity:** intercept errors on review and overview. [#1464](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1464) ([96316d8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/96316d8c6482827a8dd1d3aa5fe0790517f94181))

## [2.13.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.2...v2.13.3) (2024-01-12)


### Bug Fixes

* **api:** log filtering inside tap to avoid crash. [#1458](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1458) ([84a4168](https://gitlab.com/24-heures-insa/overbookd-mono/commit/84a4168b1c788db78b24cb338bfb51ae1d1c9421))
* **signa:** allow signage update. [#1459](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1459) ([241fe29](https://gitlab.com/24-heures-insa/overbookd-mono/commit/241fe296af8aeb3277ca2a4bdc8d11b253f05258))

## [2.13.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.1...v2.13.2) (2024-01-12)


### Bug Fixes

* **festival-activity:** download preview for logistic. [#1457](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1457) ([0e7d41b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0e7d41bd791fb03c54471af497475153391ea9d5))

## [2.13.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.13.0...v2.13.1) (2024-01-11)


### Bug Fixes

* **festival-event:** allow inquiry clearance. [#1456](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1456) ([89a1cae](https://gitlab.com/24-heures-insa/overbookd-mono/commit/89a1cae6ee8bfe9a1e056aae41a6b704c11e41c1))


### Refactor

* **festival-activity:** rename package to festival-event. [#1454](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1454) ([24e0a3b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/24e0a3be2e30786d0bcf0d428274a929666fc8b0))

## [2.13.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.12.0...v2.13.0) (2024-01-07)


### Features

* **personal-account:** enable shared meals. [#1450](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1450) ([9f97953](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9f97953ea653ec22eeb1aafea7a6251a60d7c4fd))
* **public-animation:** adapt page with new fa [#1448](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1448) ([b7e3222](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b7e322287babc6bfa46964cd14fc6207760984ea))


### Bug Fixes

* **festival-activity:** remove old fa modules in api [#1370](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1370) ([f7668a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f7668a1c906575571f1e64eecdb3c84aaff6d60b))
* **festival-ativity:** migration to remove old fa ([c93e0a7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c93e0a73278e763cf51c3dc5f94249a35545d2e0))
* **web:** enable shared meal shotgun. [#1449](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1449) ([3f5277a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f5277a989311c443a097b31117eb87532597809))


### Pre-Features

* **gear-dashboard:** get gear details for graph [#1440](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1440) ([cc17faa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cc17faa88c365cd57e60810ab85da2d0a4840b73))
* **personal-account:** enable expense record. [#1451](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1451) ([576656f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/576656fd63ebad46b1e8f44e1a4aeb11da19b202))
* **personal-account:** enable shared meal api. [#1289](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1289) ([8721775](https://gitlab.com/24-heures-insa/overbookd-mono/commit/872177504bc7db6a9082e96bd615cf2913bd34ff))
* **personal-account:** shared meal list page. [#1289](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1289) ([10c8fd0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/10c8fd08b5dcde291e41812ff9c4d5ebee91fcc2))
* **summary-gear:** create api module [#1439](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1439) ([34008a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/34008a05cb73edc6851277288b150fa49c879202))

## [2.12.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.7...v2.12.0) (2024-01-04)


### Features

* **web:** create gear-recap page and add it to pages-list. [#1420](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1420) ([8b2de34](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8b2de34a0cd1c084b6d8588d9ee3e60bf50f03ef))


### Bug Fixes

* **api:** 🚑 rename command ([ef0da6a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef0da6adb5a1c49f84f6ed20140623354576d48a))
* **festival-activity:** allow filter on adherent in charge. [#1402](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1402) ([4a6338a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4a6338af1b50d61ad9dd00c560a0978a42028305))
* **festival-activity:** filter out deleted ones from statistics. [#1435](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1435) ([a4ec1f7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a4ec1f7d1aa6abe4a30d44f3281561bbf4bdc410))
* **festival-activity:** switch general time windows under humain review. [#1441](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1441) ([3767126](https://gitlab.com/24-heures-insa/overbookd-mono/commit/37671261ff78353351c9e0e8379ed10381c8a9dc))


### Pre-Features

* **recap-matos:** add an icon for consumable gear [#1424](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1424) ([55a0572](https://gitlab.com/24-heures-insa/overbookd-mono/commit/55a0572579fd1855f9cacdbb8143121f3fc69040))
* **recap-matos:** create expansion panels, fetch gear and display the name of the gear [#1421](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1421) ([1844245](https://gitlab.com/24-heures-insa/overbookd-mono/commit/18442457577c386ddebb2b28fc1fabedc8d05d6f))


### Refactor

* **festival-activity:** activity time windows always validated by humain [#1442](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1442) ([95dbd6d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/95dbd6d41e1d194db56cda74bdc36e376723686c))
* **personal-account:** meal sharing with list and details. [#1289](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1289) ([f229e6f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f229e6f2f477c3c5e64393abc358227de2297ac7))


### CI/CD

* **api:** 🧪 e2e tests ([03e7862](https://gitlab.com/24-heures-insa/overbookd-mono/commit/03e786290492aae309a96b5d13cffc32e0425ba7))

## [2.11.7](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.6...v2.11.7) (2023-12-21)


### Bug Fixes

* **festival-activity:** don't generate time window when one already exist during to public activity switch. [#1434](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1434) ([4537d89](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4537d892b8e826c1166cb9112f02bf2be153b8d3))
* **personal-account:** filter out deleted transactions. [#1433](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1433) ([8792495](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8792495392f23861fb735e40130b721040252c68))
* **web:** remove sort on inquiry table action column. [#712](https://gitlab.com/24-heures-insa/overbookd-mono/issues/712) ([ea74098](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ea74098e25bf9859caa3146d3c2995d4f648d202))

## [2.11.6](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.5...v2.11.6) (2023-12-20)


### Bug Fixes

* **festival-activity:** add security dashboard. [#1417](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1417) ([f554479](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f554479d7ef476e05031725205edeabada5d126a))
* **festival-activity:** open details on new tab. [#1429](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1429) ([24a8342](https://gitlab.com/24-heures-insa/overbookd-mono/commit/24a8342f16dfcf6de5ce783ee77147462e0fda8d))
* **web:** calendar previous and next date. [#1431](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1431) ([02a49d1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/02a49d1196d8a5ae8ae50abe3b9b016469034244))

## [2.11.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.4...v2.11.5) (2023-12-19)


### Bug Fixes

* **festival-activity:** send email on adherent in charge on validation. [#779](https://gitlab.com/24-heures-insa/overbookd-mono/issues/779) ([3687816](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3687816b9f994527b8a063c165f9940527eacec6))
* **festival-activity:** send email to adherent in charge on first reject. [#779](https://gitlab.com/24-heures-insa/overbookd-mono/issues/779) ([8a30d6a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8a30d6aaf95e6561a056dbe6797f90740cd25134))
* **signage:** split fetch data & images [#1430](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1430) ([0006514](https://gitlab.com/24-heures-insa/overbookd-mono/commit/00065148ba4500ae05d06f89fb3168c641fa62aa))

## [2.11.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.3...v2.11.4) (2023-12-19)


### Bug Fixes

* **slugify:** update service [#1428](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1428) ([e0df1e3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e0df1e3b5ed73e65b5714423ecb89b6ea591a76c))


### Pre-Features

* **festival-activity:** add signa validation in web [#1408](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1408) ([49b9c0d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/49b9c0d95c44ed6dd813a4f3fdb44419d4e9c365))


### Refactor

* **festival-activity:** Add free pass in security section [#1427](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1427) ([61000c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/61000c09a329921d088f2a43f92b36bebf4177b8))

## [2.11.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.2...v2.11.3) (2023-12-17)


### Bug Fixes

* **festival-activit:** dispaly all timewindows on calendar. [#1363](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1363) ([bf8992b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bf8992b586cef2e392085b355808bdf63d581289))
* **statistics:** adjust to new festival activity model. [#1383](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1383) ([6d8d6e9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6d8d6e9d7897cca97fda77eddcacc198362d8a40))


### Pre-Features

* **festival-activity:** add remove fa in web [#1414](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1414) ([63758ef](https://gitlab.com/24-heures-insa/overbookd-mono/commit/63758ef9492134916958fbbb8cc5b37f79325639))

## [2.11.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.1...v2.11.2) (2023-12-15)


### Bug Fixes

* **festival-activity:** add in review event in history. [#1419](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1419) ([f14901d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f14901d6e1dc91fbcbac7ac9db23f60f4280a2a0))

## [2.11.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.11.0...v2.11.1) (2023-12-15)


### Bug Fixes

* **ci:** downgrade docker version on runners. [#1423](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1423) ([548d29b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/548d29b6dd218e0596309ae15abb891d33d13c61))
* **festival-activity:** allow ask for review on refused activity. [#1419](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1419) ([c30d35c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c30d35ca128f6c9ad20008a71a33b919e6f5474c))
* **festival-activity:** allow time windows update when approvers don't have requests. [#1413](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1413) ([f44d846](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f44d846c0f1871463b27526d17baa5a8f9cde831))

## [2.11.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.10.1...v2.11.0) (2023-12-14)


### Features

* **festival-activity:** display history with feedbacks. [#1411](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1411) ([9bfbcad](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9bfbcadc580f3bb0dd814eb287ef8ca436a42e78))


### Bug Fixes

* **festival-activity:** matos validation form [#1416](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1416) ([49748c4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/49748c4657a610147741799f8aec48b0c93ed02b))
* **repo:** add a "/" to ImageRepo to fix 400 error ([8eaad5b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8eaad5bae2069f23477af347710d610d4212d24e))


### Pre-Features

* **festival-activity:** implement signa validation in api [#1409](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1409) ([08be4aa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/08be4aac75aa0c8bdc653cb25b176d5a27cdd5b9))

## [2.10.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.10.0...v2.10.1) (2023-12-12)


### Bug Fixes

* **festival-activity:** handle slashes in signage text and size. [#1410](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1410) ([07ca1b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/07ca1b8a921328b4e1752ed0349987bcaa11bf92))


### Pre-Features

* **festival-activity:** add signage assin in domain [#1403](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1403) ([fd0eb1f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd0eb1f16958f7abf2f2af5be1345b7ebaf867b1))

## [2.10.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.9.2...v2.10.0) (2023-12-10)


### Features

* **festival-activity:** link inquiry request to drive. [#1405](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1405) ([7cfef23](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7cfef23573984d6f6fb1b65aced5f47337381ed6))


### Bug Fixes

* **festival-activity:** add bottom margin in fa listing [#1406](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1406) ([8c982f9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8c982f9cf804ab9ce800f8ae13648b651f48c3fe))
* **festival-activity:** customize reject reason. [#1404](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1404) ([2ab4f69](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2ab4f69f6e03a02d3b3d2f0257f2c44de932e8ef))
* **personal-account:** :fire: display payor / payee in transfers between adherents [#1351](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1351) ([413c00f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/413c00fef3cdd5c4f72a4501f61c5378abb6e8c5))


### Pre-Features

* **festival-activity:** link drive to inquiry request. [#1405](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1405) ([15e904d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/15e904d38c64ca1b55df4835c4503276c4fcc8f9))


### CI/CD

* **triage:** remove 0.4 rule ([a50046f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a50046f9afc5864c69e60f24f189906381fcef5f))

## [2.9.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.9.1...v2.9.2) (2023-12-08)


### Bug Fixes

* **festival-activity:** allow last general time window remove on private activities. [#1400](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1400) ([beeb161](https://gitlab.com/24-heures-insa/overbookd-mono/commit/beeb1611ffe9bd3c8c6ebec7ce04ef2374519ce6))

## [2.9.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.9.0...v2.9.1) (2023-12-07)


### Bug Fixes

* **festival-activity:** lock signa approve ([8bf688a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8bf688a86347467446e046ae2bccf6eb0ddd405f))

## [2.9.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.8.3...v2.9.0) (2023-12-07)


### Features

* **festival-activity:** allow approval. [#1391](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1391) ([76f8251](https://gitlab.com/24-heures-insa/overbookd-mono/commit/76f8251fed7ead001c1a2cbf67310197195a574f))
* **festival-activity:** allow rejection. [#1391](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1391) ([20a6dd6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/20a6dd62e510c408d82cb390a63aa45000d8860c))
* **signa:** add and display pictures for catalog ([eb995c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb995c0615ab03a3ddc3d5035c2931a9bb3dcc6e))


### Bug Fixes

* **festival-activity:** filter on page load. [#1395](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1395) ([64486c9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/64486c91f5691e2123e057227a6b5a703f25abd3))
* **festival-activity:** filter on review status. [#1396](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1396) ([21d5eae](https://gitlab.com/24-heures-insa/overbookd-mono/commit/21d5eaefd4bb960fe1645718e1311254c5af743b))


### Pre-Features

* **api:** allow festival-activity rejection. [#1391](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1391) ([03130cd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/03130cd63a93532fe4bc4838ac396f66238cbeb7))

## [2.8.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.8.2...v2.8.3) (2023-12-06)


### Pre-Features

* **api:** allow festival-activity approval. [#1391](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1391) ([a139eff](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a139eff453908ee215a1cd5121833eff887fb323))

## [2.8.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.8.1...v2.8.2) (2023-12-05)


### Bug Fixes

* **festival-activity:** order by ascending ids. [#1393](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1393) ([84f097b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/84f097b1a058701494a499c86e8f864d6dd3b4d3))

## [2.8.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.8.0...v2.8.1) (2023-12-05)


### Pre-Features

* **festival-activity:** reject for reviewers. [#1389](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1389) ([97012b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/97012b6f3bf5c3f4ba12bafe6c9fe15eec2c3a84))


### Documentation

* **api:** use one of festival activity previews or details dtos. [#1390](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1390) ([ecd6777](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ecd6777e1d9ad01baf1acf7d8658a8db7455f725))

## [2.8.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.7.1...v2.8.0) (2023-12-04)


### Features

* **festival-activity:** handle list items life cycle. [#1371](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1371) ([bd540d0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bd540d0ab34e34f6ea3e313ceddea5ba82614d35))
* **festival-activity:** persist lifecycle events logs. [#1366](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1366) ([3793185](https://gitlab.com/24-heures-insa/overbookd-mono/commit/379318578cb0209ea2478a66c381798f9fdcefb2))
* **festival-activity:** set VALIDATED when all required reviewers APPROVED. [#1334](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1334) ([ed4699f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ed4699f2e38beb45a279e473a2e2a9b9a17eb773))


### Bug Fixes

* **fa:** added the interrogation point [#1367](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1367) ([239ab06](https://gitlab.com/24-heures-insa/overbookd-mono/commit/239ab06319f329f7f09f8bb0e8749ab94cafb5a7))
* **festival-activity:** lock validated sections except inquiry. [#1334](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1334) ([f0dd993](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f0dd99392101926111ed5f942cd80a2c27ef514e))
* **festival-activity:** time window & signage form [#1373](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1373) ([b27766e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b27766edd394f5772ce0b70e4b8b3c7bf979a3b7))
* **personal-account:** accent insensitive user search [#1349](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1349) ([c5030cb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c5030cbbacebf2419c552fa63f700e77db83eb7d))
* **web:** display multiline messages. [#1387](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1387) ([98d7a83](https://gitlab.com/24-heures-insa/overbookd-mono/commit/98d7a835881811e5a898a74ab85a60685f18382e))


### Pre-Features

* **festival-activity:** add inquiry timewindows [#1356](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1356) ([67b68f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/67b68f502bc58085e6b3b28469b8688935122b4b))
* **festival-activity:** add time window form [#1358](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1358) ([ec167f1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ec167f1d7d542ff62b1660d6206b3a36e69b9088))
* **festival-activity:** Implement feedbacks in domain et api [#1355](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1355) ([c69846a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c69846a8cc70cb302ac46993dcf47dc8393c9c9f))
* **festival-activity:** implement find & findAll in api [#1345](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1345) ([4bb9251](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4bb9251efe315833df5f1e20b26ad38533d8f654))
* **festival-activity:** open fa page & refactor general section [#1352](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1352) ([92fc27b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/92fc27bd3b7a43650d11881c5edb96117d479b2a))
* **festival-activity:** publish feedback. [#1369](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1369) ([99d575b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/99d575bb05f9c87e75293395db479ae5482cf869))


### Refactor

* **fesitval-activity:** remove old components [#1378](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1378) ([dd9f9a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dd9f9a269a6494291f80bfc1bf3e51dc61221a9a))
* **festival-activity:** signage form [#1359](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1359) ([eacbc13](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eacbc131c92d84b00c5ae88f23e1ba3a5fbad57d))
* **festival-activity:** signageTypes variable in dtos. [#1371](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1371) ([71a2a73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/71a2a731d50fe426ee2c57a0199fcd53d5448f36))
* **festival-activity:** update signa & security card [#1353](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1353) ([ed1be12](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ed1be128ff01cedc500d18ffb0fe3f33b9fc2e90))
* **festival-activity:** update supply & inquiry card [#1354](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1354) ([d0745b3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d0745b398429e12fc165f686118fe2dcb9f5b640))

## [2.7.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.7.0...v2.7.1) (2023-11-28)


### Bug Fixes

* **catalog-signa:** fix permissions signa map [#1341](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1341) ([f78d046](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f78d0464c21162c9c79963620c7c1a0166fd6a23))
* **login page:** change "password" into "mot de passe" ([0157363](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0157363f68c3da116d4f82864390d7ea172ca5a4))
* **transfer:** Wrong error message with amounts bellow 1 euro [#1304](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1304) ([b0f8282](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0f82829553e996e3e668249c64bad88e9c01eec))


### Pre-Features

* **festival-activity:** add fa in db [#1343](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1343) ([7785a0b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7785a0b53793dc0515707bda01ad6109c341cb6d))
* **festival-activity:** allow drive assignment on inquiry requests. [#1334](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1334) ([7b487f2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7b487f293adef0e696902ad887f88c85118100de))
* **festival-activity:** allow reviewer approval. [#1334](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1334) ([6d76fef](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6d76fefcc08abf5cb57cf8b6feaf31a0ace6b9d1))


### Refactor

* **fa:** showing list in fa index page [#1342](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1342) ([9a4f35b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9a4f35b2ae5502436a98aabfc579baf86b421273))
* **festival-activity:** split test helpers for preparation. [#1334](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1334) ([8c321ea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8c321ea3135ac28bc15f6b93b7a55510831aa6fc))


### CI/CD

* update triage rules ([f651ea8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f651ea84403266b49fc4d99d8c49f2146e66d29c))

## [2.7.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.6.1...v2.7.0) (2023-11-24)


### Features

* **personal-account:** use new barrel configuration for sg. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([0f4940f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0f4940fe4539bb4cf74c6a2bce6f5deb78217b55))


### Bug Fixes

* **authentication:** block authenticate with deleted user credentials. [#1339](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1339) ([ae4867a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ae4867a54291b6a9cb7e88704558e7d5397ce80f))
* **conf:** eslint parsing on web files ([2a5b8a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2a5b8a0ae593fc01d8945b33f73a46219c80f9b9))
* **notifications:** notify only sg when new adherents are registered. [#1325](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1325) ([e5ff885](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e5ff8852c3b70e6f8e1376a4e538ba5d11fe86e0))
* **user:** forget user instead of deleting him. [#1340](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1340) ([aa1a0ae](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa1a0ae1d33a92b6f6c523ecf3808b9debacc0b9))


### Pre-Features

* **festival-activity:** allow inquiry initialisation. [#1333](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1333) ([3a822ad](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3a822adc95d5c917dba338ed3ceb5ffa2ef32125))
* **festival-activity:** handle add and remove requests on inquiry for in review activity. [#1333](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1333) ([736408f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/736408fd3a1808e7914a01a757ec1ce17024a2a7))
* **festival-activity:** handle add and remove time windows on inquiry for in review activity. [#1333](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1333) ([599da74](https://gitlab.com/24-heures-insa/overbookd-mono/commit/599da748ccf63143de177fc4d5d4bb52e24c5590))
* **festival-activity:** Implement Supply section for In review FA in domain [#1329](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1329) ([65c8c6e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/65c8c6ec46cbb0e34853c7f92f22c02d8193e20b))
* **festival-activity:** signa section for in review. [#1330](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1330) ([0b871b1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0b871b194b9a286e99d27feaa5e692ffd73c69da))

## [2.6.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.6.0...v2.6.1) (2023-11-16)


### Bug Fixes

* **festival-activity:** section partial update ([b330ab7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b330ab7e34faffba7230a8ae528ee6c8f0d5723c))
* **personal-account:** use barrel price dedicated endpoint. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([b50a28a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b50a28a5bb281fabb9f52698143a03d991deaf70))
* **personal-account:** use dedicated endpoints and store for barrel prices. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([600ff1c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/600ff1c20f187abb262b5e69f07c51f97f3c3641))
* **trombinoscope:** :camera_flash: display only volunteers. [#1260](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1260) ([7e76644](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7e76644cbbc44c16a8d1f685ae2c9da9aefa0b66))
* **web:** Remove cross to delete role for normal users [#1307](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1307) ([411ac75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/411ac756774798cce6a7eb7864c1dc858aa6968a))


### Pre-Features

* **festival-activity:** Add contractors in domain [#1316](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1316) ([444a04d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/444a04d27d45b63b52368b7c40f5581761fc4b32))
* **festival-activity:** add elec supply in domain [#1317](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1317) ([cd9f3bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd9f3bdd1f9bc020bfa1ac4da6d277326ac2a285))
* **festival-activity:** add gear inquiries in domain [#1320](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1320) ([18833a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/18833a01163352731955f810ce1299381c5623d3))
* **festival-activity:** Add inquiry time windows in domain [#1319](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1319) ([4267bca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4267bca4efa3934b86a2a41ff581d7ac60407789))
* **festival-activity:** Add signage needs in domain [#1322](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1322) ([41be018](https://gitlab.com/24-heures-insa/overbookd-mono/commit/41be0189a94e3c97bf50553b19a9fd874470e758))
* **festival-activity:** expose review status for each reviewer. [#1315](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1315) ([6bcdfa7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6bcdfa7e4f7e7c61f04a231f147d3778cdc0edcf))
* **festival-activity:** implement in review general [#1328](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1328) ([8e9c7c9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8e9c7c96fb18253eb27a3d5fc8b7e0a2bdc3a350))
* **festival-activity:** Implement InCharge section for In review FA in domain [#1329](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1329) ([1391ca0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1391ca0979ef4d071edc917b418184d0757ce103))
* **festival-activity:** Implement Security section for In review FA in domain [#1331](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1331) ([00f7f21](https://gitlab.com/24-heures-insa/overbookd-mono/commit/00f7f2161549a478d68a847171403aa0f144b1a5))
* **personal-account:** better barrel managment for sg. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([f18481f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f18481f5dea0393c327171e30b3418e5281635dd))
* **personal-account:** manage barrels individually. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([b540d94](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b540d94c77133cae69179e1416ab093f5faa7c96))
* **personal-account:** update barrel dtos to CRUD. [#1324](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1324) ([7c4c669](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7c4c669bc5f789d289a5747f22b00a440ebe47f0))


### Refactor

* **home:** add firstname in home page [#1259](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1259) ([8910ebd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8910ebd2dd851df6829ee4a8df52efed9d396ab2))


### CI/CD

* **renovate:** Chore instead of Fix in MR title [#1318](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1318) ([33f87b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/33f87b6cf454ed01bc1cb2df8ab3bae805b279a7))

## [2.6.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.5.2...v2.6.0) (2023-11-05)


### Features

* change logo ([28268ab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/28268abdf851306bd81708846961368323fbb7c7))
* **signa:** S'amuser avec des API de carte [#1268](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1268) ([2bf9594](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2bf95946e8c3d2ed761608a7fe5c78de25b62e9e))


### Bug Fixes

* **catalog-signa:** creation error [#1313](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1313) ([0d31eeb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0d31eebe3d782a163a9a358d8a45ce22fa3f3cb0))
* **deps:** update dependency jwt-decode to v4 ([4bbd3f4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4bbd3f4e3801af720cb922f77d0a857aa5151917))
* **deps:** update web dependencies (major) ([7cb0dea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7cb0deaf8bd3e363f0d46584796fa66318f48ec3))
* **nuxt:** installation error [#1303](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1303) ([5e81c93](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5e81c939a4a66f712fd373c5d1029f5fbf91cdbc))
* **personnal-account:** Fix euro display in personnel account [#1286](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1286) ([d5194a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d5194a12582af42a701bc15cf7c889c16e1607bf))


### Pre-Features

* **festival-activity:** implement time windows in domain [#1299](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1299) ([9e0f502](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9e0f502a69d18a70f65b10195f3c64c90bf6350d))


### CI/CD

* :construction_worker: remove unconfidentializer ([631f90f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/631f90fbd74edf6754fab8396cda35f2de21bdf6))
* **python scan:** run only with our conditions ([c598153](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c598153122eeebe2a5b319b139e7190460d96df5))
* **sementic-release:** :art: Add CI/CD, pre-features, docs, refactor and perfs sections ([101466f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/101466f8c69332e32f0108cd8d40bf90117287ad))
* **triage:** :construction_worker: remove triage ([d8fc34f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d8fc34f3b2969920014f7067b0b512b923b2507b))

## [2.5.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.5.1...v2.5.2) (2023-10-20)


### Bug Fixes

* **registration:** enable forget about not validated user. [#1294](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1294) ([4b5bae3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4b5bae3ba111a6ced6b22effc2c3be6bbc4194a5))
* **web:** wait for my information before ask for profile picture. [#1295](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1295) ([99bf754](https://gitlab.com/24-heures-insa/overbookd-mono/commit/99bf7540984337ba8445cf39f5068181d7fe5482))

## [2.5.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.5.0...v2.5.1) (2023-10-18)


### Bug Fixes

* **forgot-password:** envoi du mail [#1292](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1292) ([5ecfab8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5ecfab8e9c07a3f53cb575950a8eede30933b92b))
* **need-help:** Fix une erreur 500 [#1293](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1293) ([8b37d5a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8b37d5a51993ef0081e40a14e1d01ba18b47fb5b))
* **user:** Clean user data when logout [#1266](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1266) ([4d6e6f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4d6e6f50f1cc6624e96f45ba2beafea7612971c0))

# [2.5.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.4.0...v2.5.0) (2023-10-17)


### Bug Fixes

* **api:** define festival activity dto. [#1290](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1290) ([50453b7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/50453b73531918122b1c8dfb4f0807f01ca3c049))
* **api:** use type instead of class on controller signature. [#1290](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1290) ([2e76443](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2e76443502ea9d2b2197c7ed6624294ada85258c))
* **web:** display profile picture. [#1284](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1284) ([6fade9b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6fade9b68fc2d9fc5e8ef3f8b81c3b85c3452cd4))


### Features

* **festival-activity:** enable creation. [#1165](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1165) ([48e8aa0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/48e8aa0597aa6540e07b124d7191a7ff01358137))
* **personal-account:** allow meal sharing. [#1283](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1283) ([b60b681](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b60b6814ac57940578ff4092e3245069ac717a7e))
* **personal-account:** Implement transfer in web [#1287](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1287) ([8f1af2a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8f1af2a038617bb0fbf5ab183c3b95f3fbfc7c29))

# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.4.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.3.1...v2.4.0) (2023-10-13)


### Features

* **ci:** automate release generation on tag creation. [#1276](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1276) ([db1df1c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db1df1ced1d99f3382a772659be5586a533ed6cb))
* **Comptes-persos:** Faire une page dédiée [#1247](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1247) ([96df67e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/96df67ee2dec140dfdc8f38872b0c23bcbbb671e))
* modify surname in VolunteerInformation. [#1281](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1281) ([06b4b59](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06b4b59f0fe3e7f6f588c2c98f00f896e3729bc0))
* **transfer:** Implémentation des virements dans l'api [#1247](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1247) ([47ca654](https://gitlab.com/24-heures-insa/overbookd-mono/commit/47ca654303865ab5536e7f44a6791ae4bcf372e1))


### Bug Fixes

* **web:** display transaction amount in euros instead of in cents. [#1279](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1279) ([8acfcb4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8acfcb4f96795d6534719a4429812770fc1f4c86))


### Chores

* **ci:** add Chore section to changelog. [#1277](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1277) ([8dba4e1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8dba4e10431a549e1017475e267575e5636783d1))
* **personal-account:** Show personal account page ([c57276b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c57276bdb1ea181fed075dd8b86e06c4796544aa))

## [2.3.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.3.0...v2.3.1) (2023-10-11)


### Bug Fixes

* **deps:** update api dependencies ([e5cf3ef](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e5cf3efc236a4faadca3bd16a55d54da94244494))
* **deps:** update dependency @nestjs/throttler to v5 ([59038da](https://gitlab.com/24-heures-insa/overbookd-mono/commit/59038da6d4d5c27a6669b5439cd3e60936ab9138))
* stop using department and year ([e43bcb9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e43bcb91c8e62e4d50af93793c944d2a67a538b6))

## [2.3.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.2.1...v2.3.0) (2023-10-09)


### Features

* **Comptes-persos:** Créer le domain transaction [#1247](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1247) ([d97bb63](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d97bb63d8bb4f47ee11b7198f7dd68923b29cc83))
* **contribution:** display settle contribution alert. [#1246](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1246) ([4029647](https://gitlab.com/24-heures-insa/overbookd-mono/commit/40296472956c2449f43535bd7df4cc83e57b2427))
* **contribution:** generate contribution alert. [#1246](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1246) ([93ad76d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/93ad76ded1b3a32cff1d5cf66779d95b0464ed86))
* **events:** implement utils and library to better type domain events. [#1257](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1257) ([0a2d52f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a2d52f47f3c522c016929b73fcf58df2f588bad))
* Le SG peut envoyer un mail aux personnes ayant un CP négatif [#1263](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1263) ([3f9477f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f9477fb6db6057777ee1944b3d6ea65d389b949))
* **signa:** Créer la page avec la liste des lieux [#1136](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1136) ([e2e0612](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e2e06127984f3deb8e6dc9949edad4e3eefe79bf))


### Bug Fixes

* :bug:  Correction de la page de statistique ([06c117c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06c117caae9a9397228996266f65fb7d7270c0aa))
* **ci:** copy utils modules in api image. [#1258](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1258) ([f315508](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f3155087e96f55d68c4fbb8409966d36aae039f2))
* **personal-account:** update consumers and total balance after save on SG. [#1269](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1269) ([8d6b8c5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8d6b8c592cc96339895be8911a0ad3405e133ed3))
* Possibilité de modifier son propre charisme dans VolunteerInformation [#1262](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1262) ([dd1e0d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dd1e0d9a7d37b5cdf717b98d3cfaa4f18670a7f3))
* remove benevole team for vehicle in seeder ([688341a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/688341aacb0fa967131f2a3e66f01d1adbd318eb))
* seed command ([bd7b8de](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bd7b8debfc60c514eb6bddb0dcb48b449994315d))

## [2.2.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.2.0...v2.2.1) (2023-10-03)

## [2.2.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.1.0...v2.2.0) (2023-10-03)


### Features

* manual bump version pipeline. [#1250](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1250) ([41726c7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/41726c76908ad0e4df4e261e10c8624eff26b88b))
* **personnal-account:** Add current balance alert. [#1246](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1246) ([0a551fe](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a551fe0d953fada599d18a003ccd1369bdb35c7))
* **registration:** notify new comers await for validation. [#1251](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1251) ([5304975](https://gitlab.com/24-heures-insa/overbookd-mono/commit/53049758f7645a56bc9afcf648eb4dd821f30300))


### Bug Fixes

* **ci:** ci compatible release command. [#1252](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1252) ([49bf382](https://gitlab.com/24-heures-insa/overbookd-mono/commit/49bf3828099f7de9bc17cb1e6ecd768a2ea94d85))
* **ci:** missing conditions on manual trigger. [#1250](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1250) ([09744cb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/09744cb565a7d3450aa76d35d9d29e49a1239f08))
* **profile:** allow reset comment and nickname. [#1254](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1254) ([55eb0d6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/55eb0d613374088ea71e5250a9ac142623a75ec4))
* **profile:** readonly email and optional nickname. [#1254](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1254) ([aa30fe1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa30fe115fb30895d223752ae6be509aa16f0f25))
* remove balance from user personnal data. [#1236](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1236) ([68f1f7c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/68f1f7c185bb007047882225ad8bc26f029fba15))
* **Seeder:** Corriger les rôles du seeder [#1253](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1253) ([5d546af](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5d546af66b5916a84b9d12c681e70dbc8944d681))

## [2.1.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.0.1...v2.1.0) (2023-09-26)


### Features

* add contribution [#1211](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1211) ([f4e911a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f4e911aa62b70c964fe434ee24abd4a9460f4202))
* alert on negative personnal account. [#1246](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1246) ([a20beaa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a20beaabac27af6ac7102233c0b94133819979fc))
* **api:** Créer le back du catalogue Signa (sans les photos) [#1137](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1137) ([6aa115c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6aa115c343de3abe0c736649ee95503ec8c7d592))
* apply new layout on all pages. [#1231](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1231) ([a24eb7b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a24eb7b984991c7efbbfcd04575d33bdefb9d057))
* **authentication:** :memo: add username in jwt ([096c61d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/096c61d582967120be3bb50243ecf5668d739755))
* change release commands. [#1233](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1233) ([5a3911d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a3911dd6baf2171768b4b5c480e04867965d9e4))
* **ci:** Add renovate schedule [#1237](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1237) ([909c2ce](https://gitlab.com/24-heures-insa/overbookd-mono/commit/909c2ceddd4fb530cd7a65fe494206068341a349))
* **ci:** autodeploy on production. [#1234](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1234) ([00a8c66](https://gitlab.com/24-heures-insa/overbookd-mono/commit/00a8c6621e46e41e2dfd44096518e5dc0ceda4cc))
* **ci:** expose global commands. [#1239](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1239) ([46971e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/46971e25ffe1a1dc4e87ef31f2547fe960cb4bb9))
* rework home page ([a650053](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a650053b6fbdc0bb649c0096de4c7af30398e76b))
* updatable profile. [#1212](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1212) ([19f36dd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/19f36dd86ca961e533d5bf845ed3a056c825b303))
* **web:** Créer la page Cotisations [#1238](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1238) ([062f6ac](https://gitlab.com/24-heures-insa/overbookd-mono/commit/062f6ace3a98a765479d740da3de1d0565fbb48e))


### Bug Fixes

* adjust card container to displayed cards. [#1244](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1244) ([d8176eb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d8176eb91860758dc788931597f3fef628a1574d))
* better layout colors ([fafb701](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fafb701bfbb6e98da218292f145ede3fdac991b6))
* **ci:** update wraning message on version update. [#1235](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1235) ([3903d44](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3903d44fb7f82389c55949d201dba5bfaee696ed))
* **deps:** update api dependencies ([aea9c45](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aea9c45b1e243e59ed0e27b34def91424cc0cc9e))
* **deps:** update api dependencies ([b72f76d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b72f76dc850e75ed339d90702f8b7b4608cbbdd1))
* **deps:** update api dependencies to v5.3.0 ([dc7d0a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dc7d0a1f116ba15d9d2bff667189f6d1fd39fe31))
* **deps:** update dependency ics to v3.5.0 ([34dfaa0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/34dfaa03c8813781dde1d9fa89fc86478b7d56e4))
* **deps:** update web dependencies ([8ec05d4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8ec05d425c52d073e14a039a7c5e102b61c6fe08))
* **deps:** update web dependencies ([b7a5c15](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b7a5c15fbb3848127e575b3c766a0d471e291a56))
* enable header links. [#1241](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1241) ([7b78b40](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7b78b40f222aa555b785c12ca6149d3ffe800e64))
* Hiérarchie du rôle admin [#445](https://gitlab.com/24-heures-insa/overbookd-mono/issues/445) ([7767619](https://gitlab.com/24-heures-insa/overbookd-mono/commit/77676192abe15662ac750ccaced4528f33d08181))
* moving text on search. [#1243](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1243) ([d1eb239](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d1eb23998b561e6c3305024f2da28a18d42aa14f))
* non fixed footer. [#1242](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1242) ([0555d3f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0555d3f4bf45a5f678383e1d8aa332b7d00f91af))
* reimplement watermark. [#1241](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1241) ([968a623](https://gitlab.com/24-heures-insa/overbookd-mono/commit/968a6239d89bea9f3f5b79e00095bbd6592331f6))
* remove redondant errors on register form. [#1240](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1240) ([4fa91cb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4fa91cb27dfb3b222667c07152ddf12a351c3fb5))
* set local db to overbookd-local ([33e1213](https://gitlab.com/24-heures-insa/overbookd-mono/commit/33e121309e57644fddc18342873cf19b2138f6a6))
* sidenave scroll ([039d3ac](https://gitlab.com/24-heures-insa/overbookd-mono/commit/039d3ace432a671e8160a487e3735b5739cfb903))
* team form link on welcome mail. [#1249](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1249) ([e4b78e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e4b78e2548c2fd5700877514b52b62a47eeab428))
* transition on sidenav. [#1245](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1245) ([2a44ddb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2a44ddb3055d1c4a388a3e614453cb58b287980f))
* **web:** filter volunteers by team. [#1232](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1232) ([a0e8d18](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a0e8d18dc854622dc7dea41f9c355bf650a9e8d5))

## [2.0.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v2.0.0...v2.0.1) (2023-09-14)


### Features

* add forget page. [#1114](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1114) ([11b943a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/11b943aab9c910bbcee746995fdcfd91a82f4f2f))
* **api:** handle forget member requests. [#1223](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1223) ([d14a389](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d14a38971bf2a3ab2b61d233eda0a92e78e6cddd))


### Bug Fixes

* **deps:** update dependency core-js to v3.32.2 ([1c65812](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1c6581257b381629640ce74064aa0d2e0b5a0cc8))
* **registration:** better welcome adherent email. [#1230](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1230) ([1159f57](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1159f5712a08ee3174dbba54f6d16aab4e1c26d0))

## [2.0.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.16.3...v2.0.0) (2023-09-09)


### Features

* add fa response dto [#1126](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1126) ([2740117](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2740117a244dd148cb7adb98126f4ae01233b3e8))
* add permissions [#1125](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1125) ([b01154c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b01154c0a65fca4e41386692b8ae1506ae05a261))
* Add User domain and implement it in Api [#1166](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1166) ([e85b12a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e85b12aa94f7f302942ebed4dea60f28ae6e5737))
* **api:** Ajouter le back de la page Inscriptions [#1192](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1192) ([6c013b5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c013b5caa15fe0c3894f98131c0d40bcfcba7b1))
* **api:** handle new payload format on registration. [#1217](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1217) ([0e01020](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0e01020c43971f154fa89f48ecff240b74515146))
* **api:** register newcomers. [#1205](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1205) ([c861c0f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c861c0f65c4d9ba92474d4fe2d779c50746c0bc6))
* **chore:** add dev in container ([9835091](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9835091cddf274dd32598278d55efe21b0115aab))
* **ci:** release:candidate command. [#1147](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1147) ([1e4c13b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1e4c13b2bb0ed9701b5fb4cace5e0a75e2f7e47f))
* **ci:** run prune, lint and format on check step. [#1200](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1200) ([1be877c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1be877c4c7d19c71a07ed92e7f1abf10d6f04c68))
* **ci:** setup pre-commit hook. [#1130](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1130) ([c433a28](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c433a28b742d661ec9da9ca5a7fd32900a080cc5))
* Créer un middleware pour contrôler l'accès aux pages [#1163](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1163) ([9b11d52](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9b11d52d91d4db9490fc064b8a17e4bf068b8a59))
* extract volunteer-availability as domain package. [#1155](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1155) ([f3720f9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f3720f96ae98f36cba77623fec3b0f63d7b20e7c))
* **Front:** ✨ add CTMA watermark [#1100](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1100) ([296b687](https://gitlab.com/24-heures-insa/overbookd-mono/commit/296b6874501609a725b7417f644e81735180578d))
* inject and display root version on api and web. [#1191](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1191) ([9011427](https://gitlab.com/24-heures-insa/overbookd-mono/commit/901142763fc3e37441f055f8662759837907a3ac))
* Possibilité d'ajouter et modifier une team dans la page config [#1210](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1210) ([7d0023b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7d0023ba5e1edf93b6bcf0791e3e8819a3f174d2))
* **registration:** add 30 days ago filter. [#1213](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1213) ([93bf8bb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/93bf8bbfa713c72a7db7c38da947679c1433edec))
* **registration:** add register form rules. [#1203](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1203) ([eb0716c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb0716cf81edbd9d291d0f0ba082afa62fb51a47))
* **registration:** expose link generation. [#1216](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1216) ([db6899f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db6899f0c4cb3756b9ea720f72615ccbe60a18da))
* **registration:** implement forget me. [#1220](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1220) ([b1bd246](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b1bd24640a778645c853b308ba93af66d7e81e54))
* **registration:** implement protection rules on forget member. [#1220](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1220) ([914282f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/914282fb21aa293642a76c05f389968d1f296fde))
* **registration:** interact with api to generate link. [#1216](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1216) ([f0ef726](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f0ef72604d60730343b711d29a031c66de625722))
* **registration:** send welcome mail according to membershipness. [#1219](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1219) ([188c6a5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/188c6a57899ac5e9d500805e76d6a79f3dacb315))
* **registration:** use new api route to register. [#1217](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1217) ([225e454](https://gitlab.com/24-heures-insa/overbookd-mono/commit/225e4547ccf0fee2d9a41b6da63d5e84e1d2a759))
* **trombinoscope:** 🖼 adding trombinoscope ([e881820](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e88182068eaafedd0d66ef376b59d890491486c7))
* **User:** :sparkles: limit login endpoint ([91d57ee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91d57eed3a592bae52fae2e22f1873eb9d823ee5))
* **web:** Créer la page Inscriptions ([20c32d3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/20c32d3c38f25e4e00d91f13f2266add914daf3b))
* **web:** Créer le front du catalogue Signa (sans la photo) [#1138](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1138) ([b5c59f4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b5c59f4d94125c5767c1dff6c07e5358a1e0d087))


### Bug Fixes

* **api:** fix la perm admin dans l'api [#1534](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1534) ([eeaa1eb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eeaa1eb82a952a8bb1ace0dc915250e65049b3d9))
* **api:** import assets correctly. [#1175](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1175) ([3a8d9b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3a8d9b9235e0e78f652c5342df16de4f2297cd0a))
* babel loader error [#1183](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1183) ([3c66ea4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3c66ea455652bd059f4e3199027b9bf7bbcec324))
* **ci-triage:** dump ruby version to 3.0 ([69b488f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/69b488f901a1bdd4e7c033a578415b2fb72f4598))
* **ci:** adapt apps Dockerfiles to internal dependencies. [#1146](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1146) ([ebdf3b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ebdf3b8dcab07795fad6c9afde93679f31e6a41f))
* **ci:** apps image build stages. [#1191](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1191) ([c8d32e8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c8d32e85148be158e953ad2d19300d323cc0031e))
* **ci:** bump pnpm version ([b7854b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b7854b61ad12c1ae4d33565ec21c3e1929623e6a))
* **ci:** copy all private overbookd packages. [#1156](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1156) ([f2745fa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f2745faa56f348804d5ad0112c62aa656e2574f5))
* **ci:** don't send message on renovate MRs. [#1201](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1201) ([2dca5d8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2dca5d8f2e5dc6085b03527e6c3972160eefeea9))
* **ci:** expose prisma schema on api image. [#1156](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1156) ([0a4e96f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a4e96fff648592a801e0490de2196e41ccd50ab))
* **ci:** fix packages versions with renovate. [#1184](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1184) ([ebd19ee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ebd19ee86d115e35896ba6656fa3ae12802504cd))
* **ci:** fix pnpm version on ci. [#1224](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1224) ([1702b6b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1702b6ba9d29f8fb9d040faf1ea87369ba326a58))
* **ci:** install trigger and build filter. [#1151](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1151) ([4f20302](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4f20302ca7bb6172250133e14f80cfed1caad5b4))
* **ci:** run all pipelines on root package deps update. [#1209](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1209) ([ca4c027](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca4c027465109610bc116476018e41aa3f7761e8))
* **ci:** use get-pip.py to install pip. [#1176](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1176) ([5789ca3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5789ca300d95ce20cc7ba1511b3578435c5e6107))
* **ci:** wait 3 days for renovate bump on root. [#1208](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1208) ([1b570c7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1b570c7e66639632c4e4af839b6a651b87e0fc95))
* **ci:** working api prod and images. [#1149](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1149) ([cd70ff8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd70ff824f8347a0450f8ffb43633ed4575c3ca4))
* clean user dtos. [#1152](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1152) ([3b9c5eb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3b9c5eba6c77ef4de7dba11f123deb3d92ee5879))
* config (eventDate) [#1150](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1150) ([f9ce333](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f9ce333b7563acb2889935b232f54e67f4318aa3))
* copy tsconfig.build.json during docker build. [#1200](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1200) ([6065812](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6065812447f0d7596fd2f548b4e01263f2a23fdc))
* **deps:** pin dependencies ([65358a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/65358a3bea3719cb2f294e336c07d5369824fb58))
* **deps:** update api dependencies ([a7a1046](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a7a10463c7f5ea3a30480bceabb6a7a6031c2181))
* **deps:** update api dependencies ([7d52319](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7d5231978ffb75c746e2f2efcb1e988548dd290f))
* **deps:** update api dependencies ([f46bccb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f46bccbe0a5934e3586c7ec3fa373ada6d775d1e))
* **deps:** update api dependencies ([39e2dab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/39e2dab76c04fad1512033022537745acc9c45e5))
* **deps:** update api dependencies (major) ([eed4b53](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eed4b530b8ab360f3d5dc15f47fc3ec0b7e9dd27))
* **deps:** update dependency html-to-pdfmake to v2.4.23 ([19347d7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/19347d76f14baf3ba810db7795a3804e8a3f49d5))
* **deps:** update dependency nodemailer to v6.9.5 ([0621750](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0621750bcdb741e9a4866091794d8949628ab2ec))
* **deps:** update web dependencies ([5d6aa16](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5d6aa16b8631cae38051ac9d369827e00f4d2a43))
* **deps:** update web dependencies ([c633292](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c6332920b93344d7e98fc1eadf6301a744258a17))
* **deps:** update web dependencies to v2.1.1 ([2b52f29](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2b52f29de5db0dd3eb603399641d925fbaa5b081))
* **deps:** update web dependencies to v2.1.8 ([b9435a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b9435a20c08706912fa2d1f44b72c026bb4d2cca))
* **devcontainer:** :hammer: add missing extentions ([eb59f15](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb59f158b28ecb449f8ba5617b211fe1ae8ca003))
* **devcontainer:** :pushpin: bump node to v20 in dev container ([2fb3766](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2fb37661a967fce9dee36f0f9802f58ae0b3b7d9))
* **devcontainer:** :whale: add missing libs & tools ([dc56869](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dc56869ef67154822f5d00b88bdd527c9712a67d))
* **docker:** :whale: install and build at startup ([42ff92c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/42ff92cd0ea1410f7a048b7a690345a3fa9c1fd4))
* **docker:** api image missing package.json. [#1148](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1148) ([4a2fd0b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4a2fd0bb675b45bd3f9781ce23eaf62ef6f1d267))
* **docker:** insall pnpm on api prod/preprod image. [#1132](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1132) ([65c7518](https://gitlab.com/24-heures-insa/overbookd-mono/commit/65c75189009eb2ee230c6d72ac3e31aa68483c42))
* **docker:** install use isolated node-linker ([37dad94](https://gitlab.com/24-heures-insa/overbookd-mono/commit/37dad94fd669a80aaceabb4e36af3453fccb0153))
* **docker:** install with hoisted node-linker. [#1132](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1132) ([4be55ab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4be55ab76b7d3912576bd5b195ddf5943dd79dce))
* missing e in bot comment [#1177](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1177) ([6ac7c12](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6ac7c12fa57fa422f0905f90136c3a2df15d902f))
* **personnal-account:** users can do transactions with other. [#1153](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1153) ([60881da](https://gitlab.com/24-heures-insa/overbookd-mono/commit/60881daed480ea578af256072732c30fbce1682e))
* **registration:** send new adherent email ([a162508](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a1625089816586629b4d6f619e3ff00d4f524b24))
* remove is_major in fa response [#1106](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1106) ([21734e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/21734e2407ee822c4000059bde4b22b7c783fd71))
* Remplacer dev.env par .env dans les commandes du package.json ([b7d13fc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b7d13fcfdb3e202e049ef70475e5539b54c3a0a3))
* Renommer les commits de lint du bot [#1171](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1171) ([1841159](https://gitlab.com/24-heures-insa/overbookd-mono/commit/184115985de7a8f9655efa6da3f0ef4cb1efdf31))
* revert teamId to teamCode ([42626d7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/42626d726c63232a78f0e4096748d6f2583c70b4))
* routes data transfert objects. [#1152](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1152) ([5ff2ce8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5ff2ce88e8b2bf2b9aeaf4cd5f8f15b667d63d60))
* teams in seeder ([2df3daf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2df3daf0d238f7152a9fdb780f1f0c3a99bcddfe))
* **trombinoscope:** :ambulance: migration with new table name ([91552f6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91552f6cdf116f3c32b8d12c64a05dfca0164d34))
* **user:** display profile picture. [#1154](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1154) ([04e9289](https://gitlab.com/24-heures-insa/overbookd-mono/commit/04e9289b654bb59bd913ddf5c9fb681829ec39ca))
* **web:** display my profile picture. [#1197](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1197) ([eb41a50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb41a50fad596e74be587b70c2f00b81aa07cee6))
* **web:** les liens vers les pages renommées [#1204](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1204) ([dbbae7e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dbbae7e65ce3cf106e16f51af00ca09ef60cd3be))

## [1.16.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.16.2...v1.16.3) (2023-05-12)


### Bug Fixes

* **timeline:** add refresh to now button. [#1099](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1099) ([1e71772](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1e71772ceccc82b1c0eb09c39b347d19a4257364))

## [1.16.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.16.1...v1.16.2) (2023-05-11)


### Bug Fixes

* **timeline:** better display on mobile device. [#1096](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1096) ([2dd0fa6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2dd0fa6985c65f2666b62e80534ad72748eccc8a))

## [1.16.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.16.0...v1.16.1) (2023-05-08)


### Bug Fixes

* **need-help:** adjust page to mobile devices. [#1094](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1094) ([58277c2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/58277c2f64dcf0294dcfd93b9b2687776bf23014))
* **need-help:** display volunteer calendars. [#1093](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1093) ([678ab7f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/678ab7fc70abc4611ce559f7cd5adcfee6b23e7c))

## [1.16.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.15.2...v1.16.0) (2023-05-07)


### Features

* **need-help:** build need help page. [#1088](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1088) ([88c8f54](https://gitlab.com/24-heures-insa/overbookd-mono/commit/88c8f54ff264f227e154669fc321a7fde37b26e9))


### Bug Fixes

* **need-help:** enable filters on date range, name and team. [#1091](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1091) ([7017881](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7017881c95cad293dd9f4ebb6376a30025b86b51))
* **need-help:** expose available volunteers via endpoint. [#1089](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1089) ([06991e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06991e2132bd3820ab7b5ad28c42110c2aec983a))
* **need-help:** fetch and display available users. [#1090](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1090) ([1cbc1f0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1cbc1f08a2dcf0da77ca1ea225b4f0e0463924f2))
* **planning:** change explanation wording. [#1092](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1092) ([cdcbe51](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cdcbe51f6d9e233592c00844c44cb6e17fdf9c6d))

## [1.15.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.15.1...v1.15.2) (2023-05-05)


### Bug Fixes

* **timeline:** display time windows. [#1084](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1084) ([7992c89](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7992c8959e41984f2b5f04f8cf06df5aab84bc52))
* **timeline:** display timespan assignees on click. [#1085](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1085) ([bb87c5f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bb87c5fabbf243e4a77770df58d63920605448cc))
* **timeline:** more readable task title. [#1087](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1087) ([f9abeda](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f9abeda4b67bf62bf6e3126e3faa3278aad629cc))
* **timeline:** send time windows. [#1083](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1083) ([242915b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/242915b3503b001f9c6c825c21c1e6a587413e75))

## [1.15.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.15.0...v1.15.1) (2023-05-02)


### Bug Fixes

* **timeline:** display 9 time markers. [#1075](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1075) ([7202c96](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7202c96a82a7775cd0050381bde20f2f338b32b6))
* **timeline:** display end period even when menu is open. [#1073](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1073) ([3222335](https://gitlab.com/24-heures-insa/overbookd-mono/commit/32223359faa4aee3a9c95ae220dacea4093a87d6))
* **timeline:** display fa team. [#1077](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1077) ([2189439](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2189439e62e952cad88ac2fce1b3284903a9b929))
* **timeline:** display task priority. [#1078](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1078) ([d4471d5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d4471d524e1d449248503a2bb918787930eabb64))
* **timeline:** filter tasks by team. [#1079](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1079) ([be1d6e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/be1d6e523b8a0ee1f2ccbc3c8031a2fd4520e590))
* **timeline:** handle dark mode. [#1074](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1074) ([ec65a95](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ec65a9535bd0b873fede2068525e07a128c29376))

## [1.15.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.14.2...v1.15.0) (2023-05-01)


### Features

* **Timeline:** Timeline page creation [#1063](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1063) ([3592e2d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3592e2d359dd832f844b3c5a47e3f6629348a5b7))


### Bug Fixes

* **planning:** copy personnal planning link instead of redirect to it. [#1071](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1071) ([7623f5c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7623f5c68634bbaa60d62d6d405e70d1fb6aa601))
* set can-view-timeline permission. ([c8fbff6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c8fbff6e3e38287320280c350c4937069a2a73c4))
* **timeline:** adjust task width and position. [#1066](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1066) ([1078a92](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1078a92a7c74c1db78af9702097462a15dbfddbf))
* **timeline:** display all FA during a 2 hours period. [#1064](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1064) ([93b25cc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/93b25cc2d54501b5f2870e2091a152355a4340f4))
* **timeline:** display tasks from events. [#1065](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1065) ([fce0d1f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fce0d1ffb1d15cf6dfca8c3af2ed04213a0ed95d))
* **timeline:** enable name search. [#1067](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1067) ([8966f53](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8966f53b3f0630b3207f696390fb07d87cc750c3))
* **timeline:** ending task duration display. [#1072](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1072) ([0d6a557](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0d6a5571fe7d813453cd485ae7d4ec995639c326))
* **timeline:** open ft on click. [#1068](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1068) ([51f9d47](https://gitlab.com/24-heures-insa/overbookd-mono/commit/51f9d471eaa2d4d30a4b4454fef4a72f5bee89ee))
* **timeline:** select range period. [#1069](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1069) ([098afab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/098afab87b00728f48128a36508302783e285871))
* **timeline:** use time axis instead of graph. [#1070](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1070) ([d0f35fa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d0f35fa8e42c0efcce87ffffba72fd6db5e50560))

## [1.14.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.14.1...v1.14.2) (2023-04-28)


### Features

* :sparkles: Display timespan in FT calendar if ft READY & Open TimespanDetails dialog on click ([fe5629f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fe5629f5dcb4e7ff87f7c66a0f1d4e1a18a27971))
* **Timeline:** Récupérer les FAs en cours ([db66e2b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db66e2bac7c960c615c0df2f8cdd85b63c74ba0b))


### Bug Fixes

* export signa CSV pour les FA validées par la signa ([4cbb540](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4cbb54001ebd1540108843a6f87baf800b657c6a))
* **planning:** add introduction page in pdf. [#1060](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1060) ([e155f96](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e155f9617eccb56c9b4f32827be714ed1f9da5af))
* **planning:** add security plan page. [#1060](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1060) ([bd9592c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bd9592c94454dfa01c20a558f140bc5addea80dc))

## [1.14.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.14.0...v1.14.1) (2023-04-27)


### Bug Fixes

* **planning:** add black line as task separator in pdf. [#1057](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1057). ([4088322](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4088322594f2a78e95d2edbe5d30f6ac7aa2c947))
* **planning:** disable download planning button. [#1059](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1059) ([53f73e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/53f73e2fca3d0ace4ce1bb6bc357908ecc0674bf))

## [1.14.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.13.3...v1.14.0) (2023-04-25)


### Features

* **planning:** add purple cocktail workflow in pdf planning. [#1036](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1036) ([877bec0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/877bec0a3b3843f3ba9f98e801d56fdc02071cfa))
* **planning:** download all plannings. [#1052](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1052) ([d8cc4e7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d8cc4e705f4fc57daa5a1d8fea15c07d8849d172))
* **planning:** enable pdf planning download. [#1051](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1051) ([5dbd4ea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5dbd4ea371fc8784ee9643be3be013f4bfa49458))
* **planning:** set pdf header and footer. [#1050](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1050) ([b3c08c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b3c08c0ef453da59a3325ebd0f63f45cbe7e163c))


### Bug Fixes

* better display on stats card. [#1052](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1052) ([4102573](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4102573acc184c8ac93f7d8b3aec02ecea326365))

## [1.13.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.13.2...v1.13.3) (2023-04-22)


### Features

* assignment stats page. [#1045](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1045) ([baec1a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/baec1a3baf5c504e00e3aabbd6bb65e59c96a1fe))
* display html in pdf. [#1046](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1046) ([127ba9a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/127ba9a0eba2fa3cf30762bca4093026637dd47c))
* **planning:** display also assigned volunteers. [#1047](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1047) ([a8a3f20](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a8a3f20f15b11b56eefbcbaaa62cf4964a2b35cd))


### Bug Fixes

* **Front:** 🐛 sliceTime remove in FT timeWIndow [#1048](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1048) ([f2e1b41](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f2e1b4110fd7e89338d5a6b13e6ff7ad07ba61dd))

## [1.13.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.13.1...v1.13.2) (2023-04-22)


### Features

* **Affect:** Show volunteer stats in orga-task calendar title [#1044](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1044) ([9de56b3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9de56b3a5cc60aefffb98ffe59631402fc7bd8b1))
* **planning:** render task list in pdf. [#1007](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1007) ([ce59f75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce59f751c75537b1bf1fec8f0be3f8e0871268a0))


### Bug Fixes

* **friend:** avoid asking deleted user as friend. [#1041](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1041) ([6f9447d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6f9447d65f077379ea452b5da93d50b082f970cc))
* **FT:** Les humains peuvent modifier les FT après validation ([dba6cad](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dba6cadd2b26175d3a7a1a71fcf04c86242587be))

## [1.13.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.13.0...v1.13.1) (2023-04-21)


### Features

* **Affect:** open new window to affect friend [#1035](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1035) ([c785537](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c785537dc913b292e450016bbbafd60178ae2f59))


### Bug Fixes

* **Affect:** Item list selection ([5d09bf8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5d09bf8deb900ad118ae2649e6283b72a8568167))
* **Affect:** update calendar with selected volunteer after unassignment [#1042](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1042) ([ba9b513](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ba9b51308d0e1d4477fa3b768f4d34e7aa12c2d2))
* **assignment:** display all remaing team requests orga-task mode. [#1032](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1032) ([3287cdf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3287cdf97c85304c8424760e8b58ef5b1b2430b7))
* **cicd:** 💚 change var name for docker scan ([c753496](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c753496d4f9ba6caeea05f4edc772770bf494eb7))
* don't switch ready ft to validated. [#1031](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1031) ([7315c0f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7315c0f7ef271e85b61ea7395851dce5d0f66fc4))
* **orga-needs:** stats for teams not associated to validated-user permission. [#1030](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1030) ([d386c3f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d386c3f741ad917e71756e79ce080931e4bdc11a))

## [1.13.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.7...v1.13.0) (2023-04-20)


### Features

* display planning card. [#1026](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1026) ([6c92bdd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c92bdde210aa365f6549a75f886eb60faf1a7d2))
* orga needs page. [#977](https://gitlab.com/24-heures-insa/overbookd-mono/issues/977) ([3d82395](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3d823959a6572507bf9f7886f4762febf9969c4c))


### Bug Fixes

* add unique constrain on timespan. [#1029](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1029) ([341851e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/341851e6a3428ea2bc9ead4ef95ad1c053ddb4b3))
* orga needs condition builder. ([ff1170c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ff1170c0ddf96356df260d6adfa2a10759895837))
* **planning:** don't generate assigments when volunteer is alone. [#1027](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1027) ([d638171](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d6381712f3f2c04235f30164f13b342570e0bc8a))

## [1.12.7](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.6...v1.12.7) (2023-04-19)


### Features

* build assignments on planning. [#1006](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1006) ([ea73f4f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ea73f4f6c33e37bfba1f2d0ffc42b921876c5c1c))
* display remaining team requests. [#1023](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1023) ([1f592b7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1f592b7ff90e4a8f8cf1ee4390fa62c79bb9680f))
* ical export. [#1008](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1008) ([4cf2d3b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4cf2d3b6b55c7051e40c8c14a2dfcc289c04302e))
* **planning:** expose public planning route. [#1021](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1021) ([4be947f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4be947f3faa8b42c3c20f84b93e7d7265e12966c))


### Bug Fixes

* **Affect:** crash quand on triple clique sur un bénévole (orga-tâche) ou une tâche (tâche-orga) ([a935f9b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a935f9b0548607965de123bc4b15805ea6c3d8f0))
* **Affect:** wrong ft id in AssignmentForm ([33477f1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/33477f193e8907b01cc9c4ecb8228bea7a627bbe))
* assign. [#1025](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1025) ([6d008f4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6d008f4510a3c98b9f1f6ecafd0f7776772ad1d8))
* don't send email to deleted users. [#1019](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1019) ([a897212](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a89721288997a8f788676f5dc85ba6676e954037))

## [1.12.6](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.5...v1.12.6) (2023-04-18)


### Features

* **Affect:** Mettre en surbrillance la tâche ou le bénévole sélectionné [#1013](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1013) ([8417622](https://gitlab.com/24-heures-insa/overbookd-mono/commit/841762202f343ac590a0108d86d6bef2bc7733fb))


### Bug Fixes

* assignment style [#1012](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1012) ([f19b606](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f19b60698c1123592bf1123d78b641a4c617fbbf))
* **Front:** 🐛 remove openFt duplication [#1015](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1015) ([4afebeb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4afebeb798ce6ffca618874b848304d2d74e88a5))

## [1.12.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.4...v1.12.5) (2023-04-17)


### Features

* **Affect:** afficher les dispos dans le form de l'affect ([72d8ce1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/72d8ce1b57c14aafcc2abd16a009b84750243d9e))
* compute volunteer planning. [#1000](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1000) ([4f7f1eb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4f7f1ebfa5e174a7f29ce5ea02126fd6faf056f8))
* **planning:** expose planning via endpoints. [#1005](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1005) ([0f22047](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0f2204744db5693a1515681d45a950b41f743f3b))


### Bug Fixes

* phone number display ([965e2d5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/965e2d541efd76e7802acc1b448e54b9e6ba1a94))

## [1.12.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.3...v1.12.4) (2023-04-15)


### Features

* ✨ compute volunteers stats by 15min intervals on a given period. [#977](https://gitlab.com/24-heures-insa/overbookd-mono/issues/977) ([3caf065](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3caf0656e7ac3b06e819098b9497ef918a217fe1))
* **Affect:** Pouvoir changer l'équipe à laquelle un bénévole est affectée ([c538ec8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c538ec83c64709b09e9daab7d7d30bd952f83074))
* **assignment:** remove last candidate. [#999](https://gitlab.com/24-heures-insa/overbookd-mono/issues/999) ([412c823](https://gitlab.com/24-heures-insa/overbookd-mono/commit/412c823ac51b1940e43e51a3e7dc8eed9394afa9))
* display volunteer stats in his calendar [#976](https://gitlab.com/24-heures-insa/overbookd-mono/issues/976) ([9db4796](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9db47968746c191a8b534b84bcdf8713ecf3c164))


### Bug Fixes

* **assignment:** filter task with null category. [#998](https://gitlab.com/24-heures-insa/overbookd-mono/issues/998) ([2ac4692](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2ac46923acfa146d458ce4a16ebfdc83b94f169b))

## [1.12.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.2...v1.12.3) (2023-04-14)


### Features

* **assignment:** display on timespan when volunteer's friends are also assigned. [#989](https://gitlab.com/24-heures-insa/overbookd-mono/issues/989) ([d3935df](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d3935dffd69a25cfd9f299f834eab86fe2317c25))
* **assignment:** group assignments. [#994](https://gitlab.com/24-heures-insa/overbookd-mono/issues/994) ([7ec10dc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7ec10dcf736655ca4a5b3c713cda8c6784204f33))


### Bug Fixes

* **assignment:** display volunteer assigned duration stats in assignment form. [#996](https://gitlab.com/24-heures-insa/overbookd-mono/issues/996) ([079b328](https://gitlab.com/24-heures-insa/overbookd-mono/commit/079b3285d9fc660422181ae620427beba3051d13))

## [1.12.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.1...v1.12.2) (2023-04-13)


### Features

* ✨ add assigned task count for current user in index page [#982](https://gitlab.com/24-heures-insa/overbookd-mono/issues/982) ([3cb486b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3cb486bae9b26eef071516dc1898e4cb7b32ddbf))
* **Affect:** ✨ add calendar icon in timespan details [#991](https://gitlab.com/24-heures-insa/overbookd-mono/issues/991) ([1b50766](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1b507665c56725f230e0bc7a8bd2723df9ebb6c7))
* **assignment:** Sort by assignemnts ([5120a5c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5120a5ca09416b505bd5b1476aea4a5421e8215d))


### Bug Fixes

* **Affect:** 🐛 update calendar after desaffectation [#990](https://gitlab.com/24-heures-insa/overbookd-mono/issues/990) ([cae237f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cae237fe160993facbfdd1b00dfa17a4dd9ae9d7))
* **Affect:** 🐛 update calendar after friend selection [#993](https://gitlab.com/24-heures-insa/overbookd-mono/issues/993) ([29ede51](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29ede518aa79f0486fba8e5f57fa8f05bfc87ed8))
* Correctifs front pour les humaines [#988](https://gitlab.com/24-heures-insa/overbookd-mono/issues/988) ([5abd507](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5abd5075365ab590998dd2b2f004dfef031d9883))
* Ne pas afficher les FT supprimées dans les FA ([d6dea1c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d6dea1c45b7f6ebc64310312bc6252741eab9c26))

## [1.12.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.12.0...v1.12.1) (2023-04-11)


### Features

* **Affect:** Afficher les détails d'un créneau dans le mode orga-tâche ([9cae07b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9cae07b9b75b883e692ad7ade4b68302ab343be7))
* **Affect:** Auto-scroll in orga-task calendar ([e51fc73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e51fc732a3a7f2cd4db643e2712eae6824b2d224))
* **Affect:** Possibilité de désaffecter un bénévole ([36b0e28](https://gitlab.com/24-heures-insa/overbookd-mono/commit/36b0e2805d1a45f439cc9370dbcf042bcefa4dbc))
* **assignment:** display volunteer planning. [#983](https://gitlab.com/24-heures-insa/overbookd-mono/issues/983) ([b2dc56d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b2dc56df370c9fa02683fdca885f23cb0f063512))
* **assignment:** mode orga -> task. [#981](https://gitlab.com/24-heures-insa/overbookd-mono/issues/981) ([8419b91](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8419b912306e9cf8005094eb7833f5b65fbe9c4d))


### Bug Fixes

* **Front:** 🐛 remove non assignable timespan [#986](https://gitlab.com/24-heures-insa/overbookd-mono/issues/986) ([cb1f23c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cb1f23cf7c6e1558eb70c35b9318f65fbfbb48c0))

## [1.12.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.8...v1.12.0) (2023-04-11)


### Features

* **Affect:** auto-scroll calendar ([c4d09e7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c4d09e738fea9fea7738c9b874722f41b8e34970))
* **Affect:** Display assigned volunteers [#962](https://gitlab.com/24-heures-insa/overbookd-mono/issues/962) ([5e5976d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5e5976db3b58030dd0ac1964fdd85a491fc00e19))
* **assignment:** assign a volunteer to a task as team member. [#957](https://gitlab.com/24-heures-insa/overbookd-mono/issues/957) ([a1adce0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a1adce09ef7a142e8ffaf86a6616debaf7210247))
* **assignment:** display daily planning before assigning. [#956](https://gitlab.com/24-heures-insa/overbookd-mono/issues/956) ([39159d0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/39159d00a85ee3d60671b9d862ce7939b5f5b466))
* **assignment:** display friend calendar next to candidate one. [#960](https://gitlab.com/24-heures-insa/overbookd-mono/issues/960) ([c90ad17](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c90ad17fff35c8f93d89c0574fd5bf46957eed48))
* **assignment:** Display if a volunteer have a friend assigned on a timespan ([bd90a8f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bd90a8fb72d8a0737f0af42e7523c63ccd4aa9bc))
* enable task-orga assignment for can affect user. [#974](https://gitlab.com/24-heures-insa/overbookd-mono/issues/974) ([242b1b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/242b1b80edb8097f34890efe8f0e19de936aa43a))


### Bug Fixes

* **assignment:** update assignment form context after assign. [#975](https://gitlab.com/24-heures-insa/overbookd-mono/issues/975) ([f0ef005](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f0ef005b7ed13dff8cdfad335552ef28ae563794))
* **volunteer:** different save buttons between personnal data and availabilities. [#978](https://gitlab.com/24-heures-insa/overbookd-mono/issues/978) ([1aa0f22](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1aa0f222dc29bad66c687c99c0796fb6f702ae94))

## [1.11.8](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.7...v1.11.8) (2023-04-06)


### Features

* display splited timespan by requested teams. [#955](https://gitlab.com/24-heures-insa/overbookd-mono/issues/955) ([caab0ae](https://gitlab.com/24-heures-insa/overbookd-mono/commit/caab0ae151d545064340e189de27353244f15fdc))


### Bug Fixes

* **ft:** rename categories variable. [#968](https://gitlab.com/24-heures-insa/overbookd-mono/issues/968) ([9d751e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9d751e5d2dfe401f826ec04f58a5f4596158dc41))

## [1.11.7](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.6...v1.11.7) (2023-04-06)


### Features

* [Affect] (Tache-Orga) Ne pas afficher les taches où il n'y a pas ou plus de demandes de benevoles ([85c0a52](https://gitlab.com/24-heures-insa/overbookd-mono/commit/85c0a522b1d84d90aac57bb7b7896f35ae330b76))
* **Front:** :sparkles: add category & priority filter [#952](https://gitlab.com/24-heures-insa/overbookd-mono/issues/952) ([ccf725b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ccf725bdd36e0db9a4f808e0e28cbf47f14b519d))
* **Front:** ✨ show friends in User information [#959](https://gitlab.com/24-heures-insa/overbookd-mono/issues/959) ([c692461](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c69246120079a0c2604df568412a114d6108eac2))
* **signa:** add amphi capelle location. [#944](https://gitlab.com/24-heures-insa/overbookd-mono/issues/944) ([e6137f8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e6137f818a550165f341b92605ddf1293c097965))


### Bug Fixes

* **assignment:** display all volunteers available for a timespan. [#964](https://gitlab.com/24-heures-insa/overbookd-mono/issues/964) ([dc8e7df](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dc8e7dfd2c5304df84bc78c0c80dd9ffc2751f6f))
* **auth:** 🐛 store email trimed and in lowercase ([6ce247e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6ce247e520951ce732ba802105b7119bdd2fb264))
* order volunteer by creation date by default. [#967](https://gitlab.com/24-heures-insa/overbookd-mono/issues/967) ([cc43dcc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cc43dcc0db88130c3088611581547199a4670662))
* **register:** allow INSA Strasbourg team. [#966](https://gitlab.com/24-heures-insa/overbookd-mono/issues/966) ([a55e175](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a55e1758b4a3eae7f09bf88eb974169963bdfee3))

## [1.11.6](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.5...v1.11.6) (2023-04-02)


### Features

* :sparkles: Ajout du conflit "Déjà affcté" [#927](https://gitlab.com/24-heures-insa/overbookd-mono/issues/927) ([a62e170](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a62e170914172ddde6306242fc1ee70453dae379))
* [Affect] Ajout du composant liste des timespans pour le mode orga-tâche ([55cc084](https://gitlab.com/24-heures-insa/overbookd-mono/commit/55cc084732b56425b0ac7a9ce255acad8117555b))
* **Affect:** Ajout du calendrier de l'affect ([407305b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/407305b87bc81f2771a90ca1f5c3a801e1d2e86b))
* **Affect:** Créer le front du composant liste des timespans V1 [#906](https://gitlab.com/24-heures-insa/overbookd-mono/issues/906) ([6a15a9e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6a15a9e3a154ae17aefff6969a4ade12593bdc39))
* **Affect:** split assignment pages ([0720669](https://gitlab.com/24-heures-insa/overbookd-mono/commit/072066912f814621299d247e7387d37b3683b3f7))
* assign volunteer to a timespan. [#924](https://gitlab.com/24-heures-insa/overbookd-mono/issues/924) ([18dd7b0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/18dd7b07c1b12912bf0a1369d4216d2c94862fe7))
* **calendar:** see assignments on calendar. [#936](https://gitlab.com/24-heures-insa/overbookd-mono/issues/936) ([3ec02bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3ec02bd1fa0118efdf8ba7d4bf76b1aea792fc65))


### Bug Fixes

* :fire: Remove bad filter ([4e90673](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4e90673884b9219d8c3d1907e44768e61feddf80))
* **assignment:** display timespan with underlying team tasks. [#946](https://gitlab.com/24-heures-insa/overbookd-mono/issues/946) ([cfbbfba](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cfbbfbae182bd47674d6ede4442116b70d32a70f))
* **Back:** already assigned conflict [#947](https://gitlab.com/24-heures-insa/overbookd-mono/issues/947) ([883b495](https://gitlab.com/24-heures-insa/overbookd-mono/commit/883b495af95bc7718af45f4bc85e75c2cab58e39))
* **calendar:** wrap event text when too long. [#902](https://gitlab.com/24-heures-insa/overbookd-mono/issues/902) ([4750706](https://gitlab.com/24-heures-insa/overbookd-mono/commit/475070680dacc9d45b28f72e1e63ec062e48ebff))
* **ft:** avoid ft ready deletion. [#935](https://gitlab.com/24-heures-insa/overbookd-mono/issues/935) ([8d05134](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8d051343c2e2080a973b82641ff0e489fd482924))
* **ft:** avoid submit ready or validated ft. [#940](https://gitlab.com/24-heures-insa/overbookd-mono/issues/940) ([4201d7f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4201d7f861eb3ede349de6d6dc43c6ccbdce3a35))
* **perf:** use virtual scroll on long user list. ([83837ad](https://gitlab.com/24-heures-insa/overbookd-mono/commit/83837adc3361b006837f8889023ef91e7ea5689f))
* **planning:** availabilty interval. [#961](https://gitlab.com/24-heures-insa/overbookd-mono/issues/961) ([3b64b90](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3b64b9040eece99d1542dbda8df8e699e415741a))
* team assignment in volunteer information. [#938](https://gitlab.com/24-heures-insa/overbookd-mono/issues/938) ([496eff2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/496eff2688c3135bf3fd5d7a839f6243fdcd5500))
* team filter in volunteer list. [#937](https://gitlab.com/24-heures-insa/overbookd-mono/issues/937) ([748d42d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/748d42d33d61dc3773e258baf7c716b63da65608))

## [1.11.5](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.4...v1.11.5) (2023-03-27)


### Features

* **Affect:** Créer le back pour le composant liste des FT [#907](https://gitlab.com/24-heures-insa/overbookd-mono/issues/907) ([ce6852f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce6852fd77ba086a4f4ec8322e657fa77a493a4d))


### Bug Fixes

* **volunteer:** export volunteer without comment. [#929](https://gitlab.com/24-heures-insa/overbookd-mono/issues/929) ([b3ceb3c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b3ceb3c4a53ec6d3d4be669acf9732354c1026f6))

## [1.11.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.3...v1.11.4) (2023-03-27)


### Features

* :sparkles: Create table Assignment ([7fd1360](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7fd136025f409189af0f314243c2c778b693aa04))
* Trier les créneaux FT par date [#926](https://gitlab.com/24-heures-insa/overbookd-mono/issues/926) ([adfdd62](https://gitlab.com/24-heures-insa/overbookd-mono/commit/adfdd6292f9490785c123f5a7f9ade7322aef068))


### Bug Fixes

* **planning:** don't show deleted tasks. [#928](https://gitlab.com/24-heures-insa/overbookd-mono/issues/928) ([05caadf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/05caadfbd96cb788ceb420347f3f510207582cd0))

## [1.11.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.2...v1.11.3) (2023-03-26)


### Features

* "Calendrier opti fonctionnalités" [#925](https://gitlab.com/24-heures-insa/overbookd-mono/issues/925) ([9288390](https://gitlab.com/24-heures-insa/overbookd-mono/commit/92883908c94209f2b4098ca3372491d2439f0072))


### Bug Fixes

* 🐛 Stripe key property from time_window list. [#923](https://gitlab.com/24-heures-insa/overbookd-mono/issues/923) ([c8dc2e0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c8dc2e06a16451e72f0037bb83d4e4915505b23b))
* Un commentaire créé dans une FT n'est pas affiché au bon endroit ([c92a779](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c92a77951ea73646367afd57a6db69959d1cea49))
* **user:** :bug: remove line return in coment. ([743cd8a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/743cd8a75f0e9465cc54073c2c945b2a1bf8eaea))

## [1.11.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.1...v1.11.2) (2023-03-24)


### Features

* **catalog:** open catalog view in read only for hard. [#916](https://gitlab.com/24-heures-insa/overbookd-mono/issues/916) ([e111447](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e111447cbbe5f389189cfb9820b590ae01b7dd4d))
* **gear-requests:** add local 24h drive location. [#918](https://gitlab.com/24-heures-insa/overbookd-mono/issues/918) ([52c96b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/52c96b67b02d7160a9cab4fd9714db996ec6a1c2))
* **gear-requests:** sort gear requests table during validation. [#917](https://gitlab.com/24-heures-insa/overbookd-mono/issues/917) ([bec3439](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bec3439cae3ea503359609b26030191dfe54d901))

## [1.11.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.11.0...v1.11.1) (2023-03-22)


### Bug Fixes

* **fa:** display rental period for consumable gear. [#912](https://gitlab.com/24-heures-insa/overbookd-mono/issues/912) ([c852757](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c852757e376a3313fcc93eab3206a761a471d8d1))

## [1.11.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.10.4...v1.11.0) (2023-03-22)


### Features

* **Affect:** add assignment modes & update friend component ([09e631b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/09e631bf776c6de2897770527aed0b3d8453aaa9))
* **gear-request:** remove part of gear request rental period. [#869](https://gitlab.com/24-heures-insa/overbookd-mono/issues/869) ([97c3b91](https://gitlab.com/24-heures-insa/overbookd-mono/commit/97c3b91c90596ad676a325b1f1e0d34aba110301))


### Bug Fixes

* **fa:** add Creaux GM drive location. [#910](https://gitlab.com/24-heures-insa/overbookd-mono/issues/910) ([abde407](https://gitlab.com/24-heures-insa/overbookd-mono/commit/abde4076f31d696b6d48a6df46fc6fbf6ca08cba))
* **gear-requests:** handle partial deletion on gear requests periods. [#869](https://gitlab.com/24-heures-insa/overbookd-mono/issues/869) ([746f95d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/746f95df8f9142bf3c1588db12dc0a517de737fa))
* **gear-requests:** handle update with period split. [#869](https://gitlab.com/24-heures-insa/overbookd-mono/issues/869) ([2a761ce](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2a761ce98df2b2e675c3b905316e80e68d842d3d))
* **gear-requests:** merge rental periods on new requests. [#869](https://gitlab.com/24-heures-insa/overbookd-mono/issues/869) ([397341b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/397341b9b8e01eb4686e18fddcfd86ff56cafa4e))
* **signa:** add signa locations: [#909](https://gitlab.com/24-heures-insa/overbookd-mono/issues/909) ([0068513](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0068513cbaacbd996710eb73d5576a60027a398e))

## [1.10.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.10.3...v1.10.4) (2023-03-17)


### Features

* **volunteer:** use global save button on volunteer information card. [#904](https://gitlab.com/24-heures-insa/overbookd-mono/issues/904) ([4ac9634](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4ac9634712f3704f6e6de8e59cbc7e50cd629741))


### Bug Fixes

* **gear-request:** filter remaining gear request after deletion. [#903](https://gitlab.com/24-heures-insa/overbookd-mono/issues/903) ([aeb1f1a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aeb1f1aa0078d943bb5e7370da55d05056c7b3c5))

## [1.10.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.10.2...v1.10.3) (2023-03-17)


### Features

* add comment edition component for soft ([54062ff](https://gitlab.com/24-heures-insa/overbookd-mono/commit/54062fff0467d71cfbec53b11edaac8bc1fc0930))
* **affect:** Use request & user filter in assignment ([66b1dfe](https://gitlab.com/24-heures-insa/overbookd-mono/commit/66b1dfee76d280f47b81f2621b07b3dd6f9ecf2f))
* **calendar:** display volunteer required fts on calendar. [#886](https://gitlab.com/24-heures-insa/overbookd-mono/issues/886) ([7916354](https://gitlab.com/24-heures-insa/overbookd-mono/commit/79163544a39477094b61e2e032c98e7ce00f8d4c))
* **catalog:** insert consumable gears. [#891](https://gitlab.com/24-heures-insa/overbookd-mono/issues/891) ([275ef8e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/275ef8eb9d0c8327949cdef51d64b212bedb96f1))
* create assignment back ([4417d56](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4417d56c13e903728fcaf773ef2d97df89699f4f))
* Envoyer un mail de bienvenue lors de l'inscription ([2422d05](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2422d05636f5eb6a0e0d6643b476b07c94fbdecb))
* **front:** add user list component in assigment V1 ([cdc1634](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cdc163466d192638b313e3a20cbc1aae151be152))
* **gear-request:** allow gear requests deletion on validation phase. [#894](https://gitlab.com/24-heures-insa/overbookd-mono/issues/894) ([d663a61](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d663a619eced8b2a7bd3b3d04df1974aad92951d))


### Bug Fixes

* **Front:** show ft filter if necessary [#892](https://gitlab.com/24-heures-insa/overbookd-mono/issues/892) ([e966bb0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e966bb0db2fbc28e2f10676bb8151fd74fa376d8))
* **Secu:** :lock: fix all bandit.113 ([1679fc7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1679fc7add48a14b9746138ea54839924a2701f5))

## [1.10.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.10.1...v1.10.2) (2023-03-13)


### Features

* **Front:** ✨ Filter FTS by reviewer [#880](https://gitlab.com/24-heures-insa/overbookd-mono/issues/880) ([a8e8fe7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a8e8fe757925b21f0dc73812746ed68d364fdab0))
* **ft:** auto assign reviewer on ft submission. [#879](https://gitlab.com/24-heures-insa/overbookd-mono/issues/879) ([c67d9ca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c67d9ca1aa1be7dfbeafc98cd3e4e17b9317c4be))
* **secu:** ✨ add csv export for number of pass ([9917f50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9917f504d8bdf61b66ce24444de074910529cacf))


### Bug Fixes

* **CP:** :bug: rework configuration store after vulnerability cleaning ([79ef67e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/79ef67ebe5f28bf4ded6656f232213b83243bd6e))

## [1.10.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.10.0...v1.10.1) (2023-03-10)


### Features

* **Front:** ✨ add friends for hard [#883](https://gitlab.com/24-heures-insa/overbookd-mono/issues/883) ([e77c349](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e77c3496993aa7152195d71da21821d2345d6db9))
* **ft:** add reviewer in ft. [#877](https://gitlab.com/24-heures-insa/overbookd-mono/issues/877) ([d9858a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d9858a10d799bbf06e74137eef0046c2bd8bc07a))
* **log:** :sparkles: handle consumable gear in catalog and FT [#672](https://gitlab.com/24-heures-insa/overbookd-mono/issues/672) ([f0b9a73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f0b9a73c5ed768d35a785f4b0c44c6f09e28800a))
* **log:** :sparkles: handle consumable gear requests [#672](https://gitlab.com/24-heures-insa/overbookd-mono/issues/672) ([1d0164e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1d0164ef08a29b905d8e151c12ce0db28dcf4cb3))


### Bug Fixes

* **ft:** conflict color. [#874](https://gitlab.com/24-heures-insa/overbookd-mono/issues/874) ([91ff99b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91ff99b29fb98a5350ddb6787721a7144fb74a51))
* **ft:** reviewer form dto. [#877](https://gitlab.com/24-heures-insa/overbookd-mono/issues/877) ([29bbd67](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29bbd676bc503325c19b8680a494f7af364907eb))
* **ft:** setup reviewer on existing fts. [#878](https://gitlab.com/24-heures-insa/overbookd-mono/issues/878) ([818dde6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/818dde606d40b593df735d5e7baf55fed0d249c6))
* **FT:** several conflict message display. [#868](https://gitlab.com/24-heures-insa/overbookd-mono/issues/868) ([930c059](https://gitlab.com/24-heures-insa/overbookd-mono/commit/930c05943f66f2d315009f9681b865e46d2bf99e))
* **ft:** update requested team for reviewers. [#877](https://gitlab.com/24-heures-insa/overbookd-mono/issues/877) ([44de4d4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/44de4d47aca47dd03fb2070228a3aca8cb8c16c1))
* **security:** code injection vulnerability. [#867](https://gitlab.com/24-heures-insa/overbookd-mono/issues/867) ([524e747](https://gitlab.com/24-heures-insa/overbookd-mono/commit/524e74741a9c51192aad70bab9b540944809a24e))
* **security:** display generic success message on reset password. [#876](https://gitlab.com/24-heures-insa/overbookd-mono/issues/876) ([c3b916f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c3b916ff92004f15e5447d538f6df824c9466400))
* User update in human page ([425eafd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/425eafdbec6bb4fcebf12355ee94c26cab7e355a))

## [1.10.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.9.3...v1.10.0) (2023-03-07)


### Features

* **availabilities:** detect when volunteer is requested but not available. [#859](https://gitlab.com/24-heures-insa/overbookd-mono/issues/859) ([0a0a92b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a0a92bdb0c8ddf5f0021cce1fe3a7e43226d534))
* **planning:** Add editable calendar for Humans ([3d4061c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3d4061cdc0ca18e06b515b4e18f28ebaebdd9cc6))


### Bug Fixes

* **calendar:** enlarge reference hour & better display on dark mode. [#858](https://gitlab.com/24-heures-insa/overbookd-mono/issues/858) ([b03b49f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b03b49f68b464926e7aab8a6b9d9e6b3327cd084))
* **ft:** filter requestable volunteers on timewindows. [#862](https://gitlab.com/24-heures-insa/overbookd-mono/issues/862) ([a382b63](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a382b63c721f7d164e67899e68b88c355c0f9a58))
* reword unauthorized error message. [#863](https://gitlab.com/24-heures-insa/overbookd-mono/issues/863) ([d658615](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d6586153e877f5365d3d3fe5bd83dfd1282c00d3))

## [1.9.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.9.2...v1.9.3) (2023-03-01)


### Bug Fixes

* **availabilities:** handle UTC dates. [#855](https://gitlab.com/24-heures-insa/overbookd-mono/issues/855) ([fea4915](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fea49157e1f9e6b7b259fabed6f2c9152e40d657))
* **inventory:** enlarge accepted content length. [#856](https://gitlab.com/24-heures-insa/overbookd-mono/issues/856) ([848f0af](https://gitlab.com/24-heures-insa/overbookd-mono/commit/848f0af3835f87064c6d007ea08e32cf7778bbf4))

## [1.9.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.9.1...v1.9.2) (2023-02-28)


### Features

* **Front:** :sparkles: little fix in text style ([29cd248](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29cd2489f1f598529462f4096826d6b1a5ad0e44))


### Bug Fixes

* **ft:** typo on refused comment. [#852](https://gitlab.com/24-heures-insa/overbookd-mono/issues/852) ([9758660](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9758660283afb3d8a40414d73815e9bb65d8c863))

## [1.9.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.9.0...v1.9.1) (2023-02-28)


### Features

* add friend removal ([f49ba82](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f49ba82b924e9747726db94d82d7561167b8f198))
* **registration:** login volunteer after registration. [#851](https://gitlab.com/24-heures-insa/overbookd-mono/issues/851) ([e73a991](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e73a99150a46dd5309a626b5ea52bf51fefe3294))


### Bug Fixes

* **availabilities:** 🎨 simple stepper. [#846](https://gitlab.com/24-heures-insa/overbookd-mono/issues/846) ([2be90c4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2be90c4432664bcf3aa30a9131b3af825ddb6556))

## [1.9.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.8.4...v1.9.0) (2023-02-26)


### Features

* :sparkles: Generate Timespans when assignementApproval [#821](https://gitlab.com/24-heures-insa/overbookd-mono/issues/821) ([ca9675e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca9675ed1a3533a49ccd90e39439e1e88e66e531))
* ✨ add volunteer availabilities [#819](https://gitlab.com/24-heures-insa/overbookd-mono/issues/819) ([02b589f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/02b589f2e04f8f4d7b3972d91526621ff2dc4a19))
* ✨ friend request system (back-end) ([05c3bd6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/05c3bd6666bbfd7275dc68af0348e0395c5f2cab))
* Add charisma period in front [#819](https://gitlab.com/24-heures-insa/overbookd-mono/issues/819) ([9417356](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9417356de165adf02ca8ce093b27545274572383))
* Add front page availabilities [#814](https://gitlab.com/24-heures-insa/overbookd-mono/issues/814) ([74ec458](https://gitlab.com/24-heures-insa/overbookd-mono/commit/74ec458e2b6cc0be6835bac812ee60d3d249ea49))
* add selection of day availabilities [#833](https://gitlab.com/24-heures-insa/overbookd-mono/issues/833) ([aafcfc2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aafcfc2f0852513945121952e7263dc58eff7a3e))
* **Availabilities:** :sparkles: Add Availabilities backend ([64062bc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/64062bc8fa1e5cccea778d501342790fd190922a))
* **Availabilities:** :sparkles: create availability system ([98b56ba](https://gitlab.com/24-heures-insa/overbookd-mono/commit/98b56ba5fc3f5e9d0c66ba032d20e2245e28230d))
* **availability:** manage user availabilities from a registery. [#819](https://gitlab.com/24-heures-insa/overbookd-mono/issues/819) ([8aa8255](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8aa8255b4a9c1e1ec205e31ca793188b040bc8b9))
* Calcule charisma in availabilities ([58cfcbd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/58cfcbdbf1a8d64e34cf083da7293a72ce70aa44))
* **calendar:** create and use OverCalendarV2. [#819](https://gitlab.com/24-heures-insa/overbookd-mono/issues/819) ([22f759c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/22f759cdbcf3902514dbd1fec6b36985b397c293))
* **friends:** add friends for non validated volunteer. [#847](https://gitlab.com/24-heures-insa/overbookd-mono/issues/847) ([cbfb401](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cbfb401279f9bd3fe91e00aa4b548409451eb298))
* **Front:** add availability model, store & repo [#814](https://gitlab.com/24-heures-insa/overbookd-mono/issues/814) ([a4aea92](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a4aea925ae12f6ff2bb1e076d71c9974d0af25a1))
* link back & front availabilities ([a740d75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a740d758637519d25713ede9a51978330c943cce))
* **registration:** new register page. [#826](https://gitlab.com/24-heures-insa/overbookd-mono/issues/826) ([788df3f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/788df3f5746d53a230f470d0e96481895659b1a5))
* Remove period availabilities [#840](https://gitlab.com/24-heures-insa/overbookd-mono/issues/840) ([f513ee5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f513ee53caba2e14f9639de634e8064cf18f9b4e))
* user creation [#826](https://gitlab.com/24-heures-insa/overbookd-mono/issues/826) ([7a52515](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7a52515c59e952e899eb9ad6b5919bfbe36993c8))


### Bug Fixes

* **availabilities:** allow non-validated volunteer to fill availabilities. [#842](https://gitlab.com/24-heures-insa/overbookd-mono/issues/842) ([7eff305](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7eff30543d8fea83b98394d72f7c25a981852ef0))
* **Back:** check if ft is deleted in userRequest for conflict [#582](https://gitlab.com/24-heures-insa/overbookd-mono/issues/582) ([5fa5702](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5fa57028c3d2eb7701df02699990d182e38d26fd))
* **Front:** :sparkles: snack message & redirection after availabilities validation [#845](https://gitlab.com/24-heures-insa/overbookd-mono/issues/845) ([dd41197](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dd4119756bee437730a8e2dcffe110f120d09ec7))
* **registration:** missing accents. [#835](https://gitlab.com/24-heures-insa/overbookd-mono/issues/835) ([02667a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/02667a2153f1d5ad57448e26f4e2346c58a887c1))
* **registration:** team selection. [#836](https://gitlab.com/24-heures-insa/overbookd-mono/issues/836) ([4065c50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4065c50c672247109455b3703471043c9a799d70))
* **security:** bump all node docker versions. ([f32a4da](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f32a4da70c7121cc25377c3fde7896a31f2f6914))

## [1.8.4](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.8.3...v1.8.4) (2023-02-13)


### Features

* ✨ Next & previous page in FA & FT [#813](https://gitlab.com/24-heures-insa/overbookd-mono/issues/813) ([e1fc280](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e1fc280ec783fd23709345da465b624c678b9938))


### Bug Fixes

* Add margin bottom to table in ft index page [#822](https://gitlab.com/24-heures-insa/overbookd-mono/issues/822) ([410762d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/410762db9d524705db80b5252b09abef1a13bb76))
* dateField refresh value [#820](https://gitlab.com/24-heures-insa/overbookd-mono/issues/820) ([f09e694](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f09e6943fd3b4ed2fd6ad0195d408f24f2853723))
* **Front:** fix error btn in login page [#818](https://gitlab.com/24-heures-insa/overbookd-mono/issues/818) ([823a32e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/823a32efdc5438c54bde44f4ee2e3d856c8ff6e3))

## [1.8.3](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.8.2...v1.8.3) (2023-02-11)


### Features

* **ft:** Add precision in ft volunteer ([b8bb755](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b8bb755f02e26a06316a1e9af0dca76d53314130))
* **ft:** display volunteers required by other fts. [#812](https://gitlab.com/24-heures-insa/overbookd-mono/issues/812) ([84781f1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/84781f114d8a50f4589b68149269dda2dccd2861))


### Bug Fixes

* **db:** publish animation migration ([ce6bf56](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce6bf56cde57c5b62783c2fa36b282bdbf85b860))
* **Front:** :bug: ft time window creation [#816](https://gitlab.com/24-heures-insa/overbookd-mono/issues/816) ([2f037b4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2f037b460c0014f6f88d3c7f984f26f3886e034f))
* Rich Editor on change ([654d004](https://gitlab.com/24-heures-insa/overbookd-mono/commit/654d004b4bb0ba2261581514564364d6296b79d2))

## [1.8.2](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.8.1...v1.8.2) (2023-02-06)


### Features

* **ft:** compute volunteer also required by ft. [#798](https://gitlab.com/24-heures-insa/overbookd-mono/issues/798) ([16e10a8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/16e10a869014d4a4f13e98197c32bd7d87ea3d5d))


### Bug Fixes

* **front:** display good transaction icon. [#811](https://gitlab.com/24-heures-insa/overbookd-mono/issues/811) ([da58624](https://gitlab.com/24-heures-insa/overbookd-mono/commit/da586245b9597c07ff2b529a9d2d256916920f6b))
* **ft:** demande de soft se supprime si on change heure de la FT ([42547d7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/42547d744729b304c0efd93764a20054e5465e23))

## [1.8.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.8.0...v1.8.1) (2023-02-05)


### Bug Fixes

* **ft:** Suppression d'un User_Request qui n'existe pas encore. [#807](https://gitlab.com/24-heures-insa/overbookd-mono/issues/807) ([e68ee50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e68ee500096901bbfe20b7178e64756518ad5db2))
* Remove min & max in Datefield ([1f1977a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1f1977a7d38a96183f8781e854608b890157d33c))

## [1.8.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.7.1...v1.8.0) (2023-02-05)


### Features

* add Feedback, Validation, UserRequests & TeamRequests in store & repo ([cece8c2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cece8c2bbfdb0808016fc27f413921a95f30bd23))
* add feedbacks routes ([23b7bf6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/23b7bf608a0e07968aacadfaaf26cb4022aaa65b))
* Add Validation & Refusal routes ([423e489](https://gitlab.com/24-heures-insa/overbookd-mono/commit/423e489b546f25f4f469417c9261ae1c36cf27b9))
* **Front:** ✨ Update FTTimeWIndow in front [#787](https://gitlab.com/24-heures-insa/overbookd-mono/issues/787) ([463b221](https://gitlab.com/24-heures-insa/overbookd-mono/commit/463b221598840adea272a92a03084b350ac2cdf5))
* **Front:** Display FA gear requests in FT ([8d358e9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8d358e9bafda1bee078f663fc6ccf3daa729c84f))
* **ft:** add and remove gear request on ft. [#795](https://gitlab.com/24-heures-insa/overbookd-mono/issues/795) ([379181d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/379181d7171ec106e8ca75fd33f0d0c9a48c2c3a))
* **ft:** add color card and disability. [#789](https://gitlab.com/24-heures-insa/overbookd-mono/issues/789) ([ca9256c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca9256ccbd215c70ff66379e4ae11e098f2d5ac4))
* **ft:** add gear request in form. [#795](https://gitlab.com/24-heures-insa/overbookd-mono/issues/795) ([abda004](https://gitlab.com/24-heures-insa/overbookd-mono/commit/abda004165a99d9b1eb26e63aa9d8d0722c9506e))
* **ft:** Ajouter la détection d'erreur des FT (avec la fenêtre avant soumission). [#788](https://gitlab.com/24-heures-insa/overbookd-mono/issues/788) ([64fcdac](https://gitlab.com/24-heures-insa/overbookd-mono/commit/64fcdacff3e540a7ddc6124aeff2fe590b329675))
* **ft:** fix user & team requests. [#803](https://gitlab.com/24-heures-insa/overbookd-mono/issues/803) ([f276c22](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f276c229fd2da497e58ca11fe602c0486ad1edd7))
* **ft:** handle user and team requests. [#801](https://gitlab.com/24-heures-insa/overbookd-mono/issues/801) ([6453fc9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6453fc9b3c1611ac33b40738b930409bfb75e3d1))
* **ft:** set drive when approving gear request. [#802](https://gitlab.com/24-heures-insa/overbookd-mono/issues/802) ([d93ddec](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d93ddecf704b9713e2f67c7534a96c43f364712c))
* **ft:** udpate gear request rental period on timewindow update. [#799](https://gitlab.com/24-heures-insa/overbookd-mono/issues/799) ([c5c1e91](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c5c1e91fd762d00c86ea37b8dbdd07ecffe7f316))
* **log:** Add static gear request listing. [#792](https://gitlab.com/24-heures-insa/overbookd-mono/issues/792) ([9920ad7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9920ad7dfa7cb57f9ea6abd77d0b662c52fa536f))
* **log:** fetch gear requests from database. [#792](https://gitlab.com/24-heures-insa/overbookd-mono/issues/792) ([bbd1545](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bbd1545eef2ac9a9ab56978633fdd4cc2b91bfcb))


### Bug Fixes

* ChildFTCard in FA ([4e62257](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4e62257ce046e2b492993c0ab5c5b099b253bc54))
* **fa:** add seeker in gear requests. [#792](https://gitlab.com/24-heures-insa/overbookd-mono/issues/792) ([95dd066](https://gitlab.com/24-heures-insa/overbookd-mono/commit/95dd066097e53ad01e11fefaf3b7fba54bcf284f))
* **fa:** don't add ANIM timewindow after anim owner validation. [#778](https://gitlab.com/24-heures-insa/overbookd-mono/issues/778) ([73c1368](https://gitlab.com/24-heures-insa/overbookd-mono/commit/73c136842370874f4941f78178e619eb51f6ed1c))
* **Front:** :bug: btn submitted disabled in draft [#805](https://gitlab.com/24-heures-insa/overbookd-mono/issues/805) ([20ba693](https://gitlab.com/24-heures-insa/overbookd-mono/commit/20ba69390bc14c68df443418762d7cc380c56172))
* **ft:** update gear request according to timewindow. [#795](https://gitlab.com/24-heures-insa/overbookd-mono/issues/795) ([0b8691d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0b8691d03fbb5775d21743335be2f6bcb1fb30e9))

## [1.7.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.7.0...v1.7.1) (2023-01-22)


### Bug Fixes

* **FA:** :bug: change case for Team ([2bcc1d1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2bcc1d1198c1f03bbe32a543217107baed37da6d))

## [1.7.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.6.1...v1.7.0) (2023-01-22)


### Features

* **FT:** :sparkles: Adding FT. [#754](https://gitlab.com/24-heures-insa/overbookd-mono/issues/754) ([022952a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/022952a833546390b7a11b8b330686d620f6fa77))
* **ft:** page index and validators in front [#754](https://gitlab.com/24-heures-insa/overbookd-mono/issues/754) ([74c1b39](https://gitlab.com/24-heures-insa/overbookd-mono/commit/74c1b39adf319cc8fe27595f702725dd7613e8a8))
* **inventory:** display all inventory records. ([f6e53ff](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f6e53ff7d21a0dc0aa3591fe15c9b7ad6a216a29))
* **inventory:** list and save inventory records ([916e719](https://gitlab.com/24-heures-insa/overbookd-mono/commit/916e7191a8a7597a29548bddfaca1bd732f3fd83))
* **inventory:** retrieve inventory record ([5602edc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5602edc6d68622e635b42ae18f0da603ea04ebaf))
* **inventory:** save inventory to database. [#781](https://gitlab.com/24-heures-insa/overbookd-mono/issues/781) ([bc3e706](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bc3e706f2f443cf661bebf39956dba4a0b01a042))


### Bug Fixes

* **inventory:** reduce groupedRecord payload. [#780](https://gitlab.com/24-heures-insa/overbookd-mono/issues/780) ([5edc656](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5edc656405cda3541b4b25ed02ba77767d8bcd5f))
* **signa:** update signa locations. [#773](https://gitlab.com/24-heures-insa/overbookd-mono/issues/773) ([bfb9f7f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bfb9f7f4a69a1c72cb5bf68e25b53b7d4e9cbcde))

## [1.6.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.6.0...v1.6.1) (2023-01-19)


### Features

* **inventory:** implement inventory update ([4485b51](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4485b51a63b6e47be458f6c256775502be87bc56))
* **inventory:** provide basic API ([105a113](https://gitlab.com/24-heures-insa/overbookd-mono/commit/105a1135597c12e3f38fa7996643d97c2c1b8757))

## [1.6.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.5.1...v1.6.0) (2023-01-18)


### Features

* :sparkles: Implement the stats for FAs ([621bfff](https://gitlab.com/24-heures-insa/overbookd-mono/commit/621bfff72e3b4f2f17d86345b10cd6557c423d76))
* **catalog:** handle ponctual usage gears. [#769](https://gitlab.com/24-heures-insa/overbookd-mono/issues/769) ([6c31596](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c3159641dc74275464c139cca9a1b399c1521bf))


### Bug Fixes

* **sg:** :bug: fix stock price round ([59dd622](https://gitlab.com/24-heures-insa/overbookd-mono/commit/59dd622c59dd00998b4904cdcfb15583a5008ef8))

## [1.5.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.5.0...v1.5.1) (2023-01-13)


### Bug Fixes

* **fa:** use the right user endpoint. [#771](https://gitlab.com/24-heures-insa/overbookd-mono/issues/771) ([06f376e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06f376e963c22468d89251c6defc803c0f1f547f))

## [1.5.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.4.0...v1.5.0) (2023-01-13)


### Features

* :sparkles: Creation du système de permission ([2caea30](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2caea3032239aa9ecc90e533cb9cddbc855e0109))


### Bug Fixes

* **fa:** clear previous gear request timewindow. [#764](https://gitlab.com/24-heures-insa/overbookd-mono/issues/764) ([3c5a79d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3c5a79d5060b6152c962c8b3ff47724c38c6679a))
* **fa:** display last validation team. [#768](https://gitlab.com/24-heures-insa/overbookd-mono/issues/768) ([908fcef](https://gitlab.com/24-heures-insa/overbookd-mono/commit/908fcef4a132f1d2c27261fd401c2cec613b5dbc))
* **signa:** add signa location to seeder. [#760](https://gitlab.com/24-heures-insa/overbookd-mono/issues/760) ([5bc3df4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5bc3df4c4b403701e6e5d9625f59232a2f226a2c))

## [1.4.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.3.1...v1.4.0) (2023-01-07)


### Features

* **FA:** ✨ no edit after validation of the corresponding part ([90722cf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/90722cfc9a4fe6ddbc962f1d1534c13f7fa7c8cd))


### Bug Fixes

* :bug: Allow several refusal ([b3f3620](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b3f3620ff5364cf7229e267bf7cad7c626d52b8a))
* **fa:** 🔗 add mailto link on email address ([94e33f6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/94e33f66d2f5f42a9330b5a4980f270d1edad61e))
* **fa:** display refuse btn on FA. [#759](https://gitlab.com/24-heures-insa/overbookd-mono/issues/759) ([d5525e8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d5525e88736db73994d9acbbe8b5e00fa6b0b80d))
* **team:** add accueil artiste team. [#728](https://gitlab.com/24-heures-insa/overbookd-mono/issues/728) ([2fcaa5e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2fcaa5e03d9a40b34a24af768bc11a4ba052a0ff))

## [1.3.1](https://gitlab.com/24-heures-insa/overbookd-mono/compare/v1.3.0...v1.3.1) (2023-01-04)


### Features

* 🎓Add CODEOWNERS ([d6dc6b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d6dc6b640a9b8bbba69964a94a5c2b32f7b61f79))


### Bug Fixes

* **Back:** Fix request elec ([71eb9a6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/71eb9a629fdcd80499dfd2fec29edeeebaf78481))
* **fa:** 🐛 TimeWindow form. [#741](https://gitlab.com/24-heures-insa/overbookd-mono/issues/741) ([aaf0a94](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aaf0a94f25f68daa46ecf90aae21f1499ebb05d0))
* **fa:** rework electricity needs. [#733](https://gitlab.com/24-heures-insa/overbookd-mono/issues/733) ([f955b0c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f955b0caf0be32df063bd7009081504f3befb0b8))
* **signa:** update locations. [#740](https://gitlab.com/24-heures-insa/overbookd-mono/issues/740) ([7830787](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7830787e7bc1ba789353ace6af4cd8f7315a7de1))

## [1.3.0](https://gitlab.com/24-heures-insa/overbookd-mono/compare/b9d104a539c7b8a39aea4ef791a564f846ca1e6a...v1.3.0) (2022-12-23)


### Features

* :rocket: script to migrate mongo user to posgresql user ([5a03057](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a03057fde84f382e8a19c5468f333ba789f426b))
* :sparkles: add traefik to compose scripèt ([4e1c9cd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4e1c9cdf63592558e9c33e441f151d70e35cd818))
* :sparkles: better user/me ([526ee22](https://gitlab.com/24-heures-insa/overbookd-mono/commit/526ee227ce614fa18ccc1e06f4561b8e6d45abda))
* :sparkles: now vscode no watching  node_modules direcories ([70a17d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/70a17d9c59469b29ec07fc94f9b9cc3a66ac0c5b))
* :sparkles: update version & patch notes ([845642f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/845642f2df9c7990282ffc66845ba39f9e7cdbb8))
* :zap: Now can validate cotisations ([6f6a0c1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6f6a0c1f224c728da6dbb5db04f033d9ef2e4a5a))
* add button to devalidate soft user ([6c07347](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c073475c79cead4ddd099c91a33996ef4a914f4))
* add delete for a table for human and admin ([acc212a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/acc212afe7e1b34586c60bf6453af31d639fd83c))
* add delete for a table for human and admin ([f09222f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f09222fe0c840d70eb234609467371afeba0b91b))
* Add http services. ([eebf760](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eebf760cc1e643489aa750af2968545ae49afbb8)), closes [#37](https://gitlab.com/24-heures-insa/overbookd-mono/issues/37)
* add toggle to show non validated user in orga mode ([fd67d86](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd67d86d67ebf87e5f440d5888c4e193bdb83a0d))
* adding authentication ([48a0696](https://gitlab.com/24-heures-insa/overbookd-mono/commit/48a0696f17b27ee7f226d9ac1fcc6dac2825e0d4))
* adding authentication ([832c5d8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/832c5d83c361e0039be8b0d7c32d494bc8e31f4a))
* adding redirect to api docs when hitting / ([052b817](https://gitlab.com/24-heures-insa/overbookd-mono/commit/052b817bf47e49a081bca252f7cf543d98fbe951))
* **affect:** :zap: show selected crenaux in tache-orga ([4c0928d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4c0928def570479ae524fce54b3887982f670695))
* **all:** 🌙 dark mode ([a28c05a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a28c05abf49f07d8adc7c506afa2da54b8215ab0))
* **all:** 🌙 role handling ([ba1c758](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ba1c758b4bb8488a22a873eb6ec03bd0ede84f3d))
* **Anim:** :sparkles: adding animation for comcom ([4d7bd81](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4d7bd81fb9d09d67ee828c68587799f4e5660ece))
* **API:** 🥭 new mangoDB API ([849f9b1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/849f9b14471aef85608aceaccf032c6084ddd280))
* **api:** add /user request ([32869f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/32869f51b4028968d25d94a9239b30e150fc3ce7))
* **api:** add connection to database ([b9d104a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b9d104a539c7b8a39aea4ef791a564f846ca1e6a))
* **api:** add logging as a middleware ([a36b0ca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a36b0ca5fd4bd113cdf5f334fd717261f3a77a97))
* **api:** added CRUD requests for all models ([ce39346](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce39346628045ecbdfa7fd3024f45ba1afd548c0))
* **api:** added default value to validity status in User model ([482ce71](https://gitlab.com/24-heures-insa/overbookd-mono/commit/482ce716923b8950b966b948a52972304aa77a3e))
* **api:** added models definition with ORM ([fac4c73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fac4c7313db6c7c7fc4e775f0bc3d54c95635a73))
* **api:** added populating script for database ([45f3792](https://gitlab.com/24-heures-insa/overbookd-mono/commit/45f3792e1ce7e229f02912ca8f8adda2c6054837))
* **api:** added requests to manipulate user ([7f71784](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7f71784fdc4f27398f12e908952d1c3e65ed5dca))
* **api:** adding 404 page ([cf6dad4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cf6dad4db66ddce99607ce20a6e710c54145e331))
* **api:** adding a request to get all the requirements on a time window ([72c135f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/72c135fd7a1b5b001d125ccf34978729f8e3f3df))
* **api:** adding config file to api ([ab5ade9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab5ade9c5a960ac784e2844af1c6d6d67f1efee6))
* **api:** adding contractor information to activity ([60c3d0e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/60c3d0eb552277d7f67681a6aea97124ffa1a774))
* **api:** adding CORS support ([21d7726](https://gitlab.com/24-heures-insa/overbookd-mono/commit/21d77266d6dd59f7f643c86bc4950d44cb83d385))
* **api:** adding CRUD requests for availabilities ([d7ba40d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d7ba40d5a1d4dfb8157ac87438b8b644d11fcccc))
* **api:** adding edit equipment component ([86fc388](https://gitlab.com/24-heures-insa/overbookd-mono/commit/86fc388580d81e739b26bf027659fb047a02f759))
* **api:** adding edit equipment component ([2fccc9a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2fccc9a4b57a2b8af2ad2984e8e909537c5b6b02))
* **api:** adding logo url to event ([d33d6dc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d33d6dc46cdbbdab494ffe3aa8754050668eb422))
* **api:** adding request for the relation activity location & shift task ([f4ccb50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f4ccb504bca3dcd664f9cc4abc8a297f71d146cc))
* **api:** adding request to bulk create shifts during a time window ([ed2af97](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ed2af97a5e150b290dd2dfa746d2bccdb2d3e7ee))
* **api:** adding request to get all the activities for a given supervisor ([bf071bf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bf071bf6c753577366d13bc683f2f97234882265))
* **api:** adding request to get all users on a given requirement ([2c9cbea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2c9cbea524e0e30fb41a86f097cceac5b1dd8bf1))
* **api:** adding request to see all locations for all activities ([0d31212](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0d31212bf9d150084d225695af4515b44ea28b1c))
* **api:** adding requests to get notifications related to a team or a user ([1a1074d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1a1074dc2b7794876172cd14172760cfd0b9143b))
* **api:** adding requests to get the tasks that require one or multiple teams, and to get tasks that requires one user ([feba3f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/feba3f5ed6868f246c210b5a4e3b0c2a0c8a9571))
* **api:** adding requests to search comment by user or tasks or activities ([210b636](https://gitlab.com/24-heures-insa/overbookd-mono/commit/210b63641fc2daa47b41662efb294141f40aeb53))
* **api:** adding search requests for activity, comment, equipment, equipment type, event, location, task, team and user ([ae11e23](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ae11e23992e72b53af6b7659cd16a5f18fdfebee))
* **api:** adding status to notification ([538e913](https://gitlab.com/24-heures-insa/overbookd-mono/commit/538e9132d12c5fbeb2f23de8a4beca5fae856536))
* **api:** adding table and request to represent friendships between users ([b205b15](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b205b1569ed76ff6d936c5241d5078ac9aec03cf))
* **api:** config changes ([2b420f3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2b420f321ede07f58d9c3ce492ee1001bc3d067b))
* **api:** CRUD for user assignment ([fd70a32](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd70a329a83909466509e72bb5ecbd4481f2ee5a))
* **api:** CRUD requests for equipment assignment, equipment requirement and user requirement ([a465d8f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a465d8f492df1e05616cc9332110321d53376fcb))
* **api:** requirement CRUD ([bfda250](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bfda250e4d318f897596c58715058c26bb2c2caa))
* **api:** return updated object on PUT requests ([5992f4a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5992f4a1717a7f93598c0f99aa3d05a44ca27919))
* **api:** uploading photo and licence scan for user [#12](https://gitlab.com/24-heures-insa/overbookd-mono/issues/12) ([809234c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/809234cb31df0b492c1b589edda805190a2e7ecc))
* **api:** uploading photo for event request [#12](https://gitlab.com/24-heures-insa/overbookd-mono/issues/12) ([f011dea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f011dea20897bdaf89fc9bb9a68b692c0b098bc1))
* **app:** :loud_sound: add sentry ([675b5a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/675b5a2d32225eb269402b3238e9182b726a9138))
* **appweb:** adding 404 page ([324ff28](https://gitlab.com/24-heures-insa/overbookd-mono/commit/324ff2868601106dc03908e83d83efdde306da42))
* **appweb:** adding a better input for phone number in user creation form [#20](https://gitlab.com/24-heures-insa/overbookd-mono/issues/20) ([8adcb7e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8adcb7e7519c2f0de204b5bf1ae0fde2cd3d3dc9))
* **appweb:** adding a component to show users [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([623ffd3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/623ffd3e81fbe607d6d0b25d1db6dc797b0abf30))
* **appweb:** adding detail equipment and map card ([4bda349](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4bda349631b32a045d1d2a10cda5fda989894c72))
* **appweb:** adding form to create location [#6](https://gitlab.com/24-heures-insa/overbookd-mono/issues/6) ([06f3560](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06f356080bcb22ed5b143a7388f5085b4d6ce336))
* **appweb:** adding form to create user [#3](https://gitlab.com/24-heures-insa/overbookd-mono/issues/3) ([e9b6b5b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e9b6b5bbd0e38531e0ddef14ecc89989c67279ac))
* **appweb:** adding keypress enter to validate ([cd0328e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd0328eaf7d79d45b434ae740caa2132935b679f))
* **appweb:** adding locale to config ([8308b1c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8308b1ce9f4efda0478c579625c2e19b5552ccaf))
* **appweb:** adding menu navigation ([7048bf0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7048bf0987b691771c8714ce289df0ba0e24aa14))
* **appweb:** adding popup visualisation of a user + adding fuzzy search for users [#23](https://gitlab.com/24-heures-insa/overbookd-mono/issues/23) & [#24](https://gitlab.com/24-heures-insa/overbookd-mono/issues/24) ([f2602e2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f2602e2b07ece1d350fef28fe2a58561aabdb066))
* **appweb:** adding search on name, surname, email and phone number [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([899bbb6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/899bbb645968c4d3847686e822ce67c2bdc57bf1))
* **appweb:** adding search on name, surname, email and phone number [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([3d9bfe8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3d9bfe877c94700d230999e64f2602c2104be4a4))
* **appweb:** adding show equipment component ([c7ac6de](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c7ac6ded55b789db6fc800dbf505f32380a44ea7))
* **appweb:** adding show equipment component ([29a44b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29a44b99b80b8bda4d05714b82a1ff90369045b3))
* **appweb:** adding show location [#26](https://gitlab.com/24-heures-insa/overbookd-mono/issues/26) ([41926db](https://gitlab.com/24-heures-insa/overbookd-mono/commit/41926db4f6bba761bb049b7f1d07fef4703c6bf5))
* **appweb:** adding team creation component ([c51c65c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c51c65cfab28b1d96d79e577ebb694d910dd8531))
* **appweb:** adding team creation component ([ffbdbbe](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ffbdbbe59f33f46336986be831a614c621699ceb))
* **appweb:** adding team manipulation view [#32](https://gitlab.com/24-heures-insa/overbookd-mono/issues/32) ([a76c219](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a76c21979097dc9c7c6943b6552beb5a5c8d9dc9))
* **appweb:** adding the possibility to place the marker by clicking on the map [#21](https://gitlab.com/24-heures-insa/overbookd-mono/issues/21) ([adb3d96](https://gitlab.com/24-heures-insa/overbookd-mono/commit/adb3d967c29b159dd5a8ad468cc43f5517ad1154))
* **appweb:** adding toolbar and button to hide navigation drawer [#10](https://gitlab.com/24-heures-insa/overbookd-mono/issues/10) ([1dd81db](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1dd81db5be7acd9b835e83fed255d2727d359b6f))
* **appweb:** adding translation support [#30](https://gitlab.com/24-heures-insa/overbookd-mono/issues/30) ([14ac603](https://gitlab.com/24-heures-insa/overbookd-mono/commit/14ac6039cd6b84b98daa3ce22f35f0bb5b8a3c19))
* **appweb:** adding vue.config.js ([0de50b6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0de50b6049a02ca33eb0a99aba3cad01b926a0d1))
* **appweb:** changing card design [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([a45ff2a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a45ff2a8709920c63eddc47cce19da0c60e6a701))
* **appweb:** changing the size of the the profile picture in the user dialog ([49f103d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/49f103d11015cc9254a431b40341a4a6404a1a86))
* **appweb:** changing the way cards are displayed + adding a filter by team [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([d74f852](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d74f852acc7f93c51d98c77bc27ab49dd8046a9c))
* **appweb:** changing the way cards are displayed + adding a filter by team [#19](https://gitlab.com/24-heures-insa/overbookd-mono/issues/19) ([b9c764e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b9c764e2d285343df9abfb25e88f7724526b353b))
* **appweb:** handling session disconnect ([f363120](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f363120befede13c3ef59945bcf45f917dfb893e))
* **appweb:** multiple small changes ([67c11d5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/67c11d5bd614dd4396dddd282c2e6301848dd2b1))
* **appweb:** navigation enhanced with expansion panels ([3ff8d2d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3ff8d2d95f39b3f965c83ec5b2af8227adcacfdc))
* **appweb:** refining location creation component to be more usable [#21](https://gitlab.com/24-heures-insa/overbookd-mono/issues/21) ([55684f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/55684f539409b95984912139ba01efa2230159a0))
* **appweb:** removing console log ([009c7b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/009c7b9503f9503796f27d2f77c1c596377ada96))
* **appweb:** uploading files for user + refactoring form in carousel to be more readable [#3](https://gitlab.com/24-heures-insa/overbookd-mono/issues/3) ([94ff9cc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/94ff9cc456cdc9398b14a39e611b781ecab105cb))
* **appweb:** using a config file to configure api host ([fce0984](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fce0984e21ed48bb5508e81097878988bfca314b))
* **assignment:**  added UsersAssignedToTimeSpan to UI ([99fdc13](https://gitlab.com/24-heures-insa/overbookd-mono/commit/99fdc133ffecb359f5e4ea40f283403f114ee803))
* **assignment:**  added UsersAssignedToTimeSpan to UI ([16ff86a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/16ff86a79f0489c5b27451409864c83cc8984ddd))
* **assignment:** ✨ update assignment store ([df64d87](https://gitlab.com/24-heures-insa/overbookd-mono/commit/df64d87c7e1a7ea03498ad2de2f65191096923fe))
* **assignment:** ✨ update assignment store ([843be69](https://gitlab.com/24-heures-insa/overbookd-mono/commit/843be69bdc643251e1881e02db2eeb7f2b0f91d0))
* **assignment:** ✨ update assignment store ([b35e4c3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b35e4c350d5c84d6574544100780ba765b580a40))
* **assignment:** ✨ update assignment store ([91584be](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91584be6cbb7672bc1f21dc7dcc531f29d1a6ad0))
* **assignment:** 📆 assign user ([4793279](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4793279b565b2447efd066af4a5d46e12d240b6a))
* **assignment:** 📆 better UI ([ee0be19](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ee0be193d1651bf416fdecfe8d08956e1efff061))
* **Assignment:** 📆 update calendar on seldcting assignment ([a7cd057](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a7cd05748ba852e406bf203f42cc48a48edd85bd))
* **assignment:** 🔨 auto assign ([6a6773f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6a6773f7205d8e08d67c1a5e7a68f777136208fb))
* **assignment:** 🔨 auto assign ([50f71a9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/50f71a9696a303a6a0282d906d39b954aae8cd6a))
* **assignment:** 🔨add new days to availability ([9487ebd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9487ebd1cfabb3069894bd211131019733131b61))
* **assignment:** 🤑 filter by team ([02c6c64](https://gitlab.com/24-heures-insa/overbookd-mono/commit/02c6c642177d1b810f574f1d67fe562659f941a8))
* **assignment:** 🥳 filter by name ([930bb79](https://gitlab.com/24-heures-insa/overbookd-mono/commit/930bb7972b6d5a41b97913e51c5a4a7c0242e129))
* **auth:** 👀 fixed max width of from [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([6621eb6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6621eb6e79078991b294e0265649b07134b2b65d))
* **auth:** 👀 revised UI [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([c904f17](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c904f17e0d70c0e4f50f46307321f16150404dd0))
* **auth:** 👋 added logout boutton ([502e3d0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/502e3d0c8c8dc05524574a006b5f2786c07f3d21))
* **auth:** 📖 added comments and TODOs [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([3060f2a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3060f2a412d14958db6db9e8c726ee92c71ba455))
* **auth:** 📣 cleaned code [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([cb927b7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cb927b75bd527965245e1de4e4bb1b794c72809f))
* **auth:** 📣 clear feedback messages [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([2bd7871](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2bd7871253ac801ba95417388adf4789b004c383))
* **auth:** 📣 corrected typo in feedback msg [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([d5ee768](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d5ee768f64263237eed4b453aebfd1fa37ebbb96))
* **auth:** 🔐 user stay logged in after refreshing the page [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([437bc44](https://gitlab.com/24-heures-insa/overbookd-mono/commit/437bc44eade316a506360e31803d9383e3f1b9c2))
* **auth:** 🔑 get token [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([ff28f03](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ff28f03ffbfadfe91008bd3c4943965c553b12ec))
* **auth:** 🔑 if user not logged redirects to /login [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([2e761b4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2e761b4da976773d0b65431aded46a6586231758))
* **auth:** 🥳 refresh token [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([d3ee1cd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d3ee1cddeabbda4126fb6de40613ae489076ea68))
* **auth:** 😞 feedback on wrong password [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([8fd6d88](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8fd6d88aa306e885f011c7ade32840ef611dba4e))
* **auth:** setting up interceptor [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([b57d176](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b57d176f1243e9d73a3608a9c4e522502ee63c0e))
* **auth:** trying yo fix redirect [#2](https://gitlab.com/24-heures-insa/overbookd-mono/issues/2) ([d0ee672](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d0ee672927da26b9ea463a0dea4997d02dd5672c))
* **automation:** ⚙️  add action to add New issue in Triage project ([8a2e4c8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8a2e4c8c3fcf893863ab0f7d8340cd5df90534d2))
* **automation:** ⚙️ add action to add New issue in Triage project ([29f92e1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29f92e150039e21f347fbb6dbdb4a77c6b9328a7))
* **availabilities:** 🔨 fix availabilities ([eda32ee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eda32eedad0d792e3ceb66a372afd9ce9c9ad364))
* **availability:** 👀 roles are restricted ([6349a4b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6349a4b7c135310bda12a8859329029611b0f5a2))
* **availability:** 📆 add new timeframes ([e76e92e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e76e92e578b35f7147cd5bba406c8dafc9fd75a9))
* **Back:** :art: enum in dto ([65c7e8c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/65c7e8c0ebc408b8fb10d6c6e43d153437556c96))
* **Back:** :fire: add dto for swagger ([6ee7e58](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6ee7e58f5f1833b28d646e26eef160c813884882))
* **Back:** :fire: migrate script ([ebc0431](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ebc043182c4bbb4f3347104222baa65a2f72e703))
* **Back:** :passport_control: add auth with token in swagger ([09f90e4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/09f90e40dc0a313cbab47a5bfb2a776391c4cf5a))
* **Back:** :sparkles: Add get by assigned route in timespan ([47b4402](https://gitlab.com/24-heures-insa/overbookd-mono/commit/47b440232b39f1a7869e1965b56593653302a725))
* **Back:** :sparkles: Availabilities now adds charisma ([3915a18](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3915a18faae1c3598d67311f12afa973e3ce8f4e))
* **Back:** :sparkles: First batch of changes ([7ee5baf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7ee5bafe327f61941d5a6c9ddd594c903f5b4705))
* **Back:** :sparkles: New route for counting timespan for a FT ([b0dc72b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0dc72be9f20eea73a9fd44b108cf81f023846ac))
* **Back:** :sparkles: New routes, will need testing ([04896fa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/04896fa8603b499a0e474222d4098881d7e25f82))
* **Back:** :tada: add swagger to project ([fd92a57](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd92a574283112156829c4316411c3ec1d5be1f4))
* **back:** :zap: add backend protection ([c44fecf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c44fecf8836038f60e7e4c8646caec2d12372045))
* **Back:** :zap: add env for jwt secret ([a6af379](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a6af3790523432d9be0db19c0d1d90f786f4b472))
* **Back:** 🌱 add seeding ([9ab6f5c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9ab6f5cae605b2933560d169719b5345e6df961b))
* **Back:** 🔐 add authenticationn ([0233e4e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0233e4ea06f5dcb41f446f48cbb5e573fad7d7f6))
* backend changes for front ([da7a4c2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/da7a4c2197d39a175a7d6e94915b2f399b17f17f))
* backend changes for front ([aa11c19](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa11c19078fb74a5e636430ba47409d65deeffd2))
* **backend:** :sparkles: add all swagger decorations ([31d76df](https://gitlab.com/24-heures-insa/overbookd-mono/commit/31d76dfda688870d558f823097c7a298ac48109a))
* **backend:** :sparkles: add config ([f79bda4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f79bda4b0c19bc5a87fc4b762446e7e5d14e6d53))
* **backend:** :sparkles: deposit now update user balance ([9707a1f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9707a1f36bb6b3d0e01cf21f2e822e4686f739de))
* **backend:** :sparkles: Schema Hamza ([a3c80e4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a3c80e41ce37df1e7c7aaa65ffa3b675d8b4a4c1))
* **backend:** :sparkles: Transaction schema ([1413668](https://gitlab.com/24-heures-insa/overbookd-mono/commit/141366822bf1f87fecfacdfd3e4030572a21fdc3))
* **backend:** :zap: update transaction service ([e6f87c8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e6f87c85e05a81bd8271be2341ab4a0f73a87319))
* **backend:** 🚨 CORS & protectt swagger ([8f9050e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8f9050e23e7471bf7eb5c7fab7694b13b17fcb22))
* **bug report:** 📣 display bug report form ([38d64ee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/38d64ee0cd91c39b16c26a54034607f79f985cdd))
* **bug:** 🐞 bug report UI ([2ae2c23](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2ae2c235ea87019b891a1566930550ef23e95799))
* **bug:** 🔨priority of bug requests ([a35d679](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a35d6797a0a383b23ffa65633c7064e06551802e))
* **calendar:** 📆 display assigned FTs ([ca9990b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca9990b9fd2fe5c11b690e3d9546987f8be50c1f))
* **calendrier_dispo:** :sparkles: red card if the user has 0 availabilities ([ab00334](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab0033462753191fb9c057cf0a1a76b3c41bae68))
* **catalog:** :art: UI to manage catalog. [#611](https://gitlab.com/24-heures-insa/overbookd-mono/issues/611) ([70b36c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/70b36c0c16dcd2afbb6be5e70cabeed15e8afc04))
* **catalog:** :sparkles: manage catalog. [#611](https://gitlab.com/24-heures-insa/overbookd-mono/issues/611) ([90fcac0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/90fcac00673bfe60d38b0f407916a1a074960559))
* **catalog:** add autocomplete gear. [#641](https://gitlab.com/24-heures-insa/overbookd-mono/issues/641) ([27468da](https://gitlab.com/24-heures-insa/overbookd-mono/commit/27468dad5c45fb33bad54a85910e867401aee4b7))
* **catalog:** delete and update categories. [#611](https://gitlab.com/24-heures-insa/overbookd-mono/issues/611) ([6b09e09](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6b09e096f9ac01d6488efa58532035c5f4e3cc0f))
* **catalog:** display reference code. [#671](https://gitlab.com/24-heures-insa/overbookd-mono/issues/671) ([76daf5b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/76daf5bf883ca66e525d5df5c3971c1f04b70ff3))
* **catalog:** dynamic filter. [#674](https://gitlab.com/24-heures-insa/overbookd-mono/issues/674) [#675](https://gitlab.com/24-heures-insa/overbookd-mono/issues/675) [#676](https://gitlab.com/24-heures-insa/overbookd-mono/issues/676) ([c88f4ee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c88f4eec4b69b05d375527bac9f92be11f708c20))
* changed number of items loaded to 20 ([e363cde](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e363cde775254f4a2dead393242d06faaf17b93b))
* **CI:** :art: Missing include ([0a77fa0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a77fa09767acc311a5c50100880710b2b57028b))
* **CI:** :lock: add docker scan ([034af41](https://gitlab.com/24-heures-insa/overbookd-mono/commit/034af41dc71b6c116a2ebf609e5f96ec12c486dd))
* **CI:** :lock: add docker scan ([94dc6c6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/94dc6c6bfbd0b916b758340b30bfbbc01c54b027))
* **CI:** :page_facing_up: add license scan ([97e2138](https://gitlab.com/24-heures-insa/overbookd-mono/commit/97e21388a789cf354e8e744ef77b335077a03f85))
* **CI:** :page_facing_up: add license scan ([8969a00](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8969a00049b0237a40ef08efb35b5b284b9f5ea7))
* **ci:** :sparkles: unconfidentializer ([2d91dd1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2d91dd1373fb274f32cb14785885803fb9c35f58))
* **ci:** 🌳 fixed env variables ([109a982](https://gitlab.com/24-heures-insa/overbookd-mono/commit/109a982536b49ccbcd18be7e0c80c9a367296cee))
* **CI:** 🔀 change stage to build more quickly ([42338e6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/42338e6e0dff883ec61b122ad7718012119b898c))
* **CI:** 🔀 change stage to build more quickly ([d2f8f99](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d2f8f9915b4148a97d94e5ce05572f523b28be3c))
* **ci:** improve ci. [#734](https://gitlab.com/24-heures-insa/overbookd-mono/issues/734) ([91e9cb6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91e9cb63b415e38d405450565182a87245aa683a))
* **clicker:** 🔎 added more info on user from humans page ([f0bd1da](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f0bd1daa38826329cd355185d5aadad12d2fba0c))
* **clicker:** 🚗 added clicker ([9acddee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9acddeebff77bf82a06806875992711b8c9b5923))
* **config:** ⚙️ added config page ([b0b064f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0b064f205cafe7c68ce9c0a0b7b998372a05d93))
* **config:** ⚙️ added configs ([3710532](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3710532b116b1645328ee9334a5ec1f1ce3179e9))
* **CP:**  added transaction history [#69](https://gitlab.com/24-heures-insa/overbookd-mono/issues/69) ([070132e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/070132ee2f9cf0b993ee7da099e81a6639ba88f0))
* **CP:** 💰 added transactionRepo.ts [#69](https://gitlab.com/24-heures-insa/overbookd-mono/issues/69) ([eb811bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb811bd947ae624b4246cdbcab68889a5e8bcf12))
* **CP:** 💰 transfers operational [#69](https://gitlab.com/24-heures-insa/overbookd-mono/issues/69) ([a7a8c90](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a7a8c90afd4257cc36f2baa56c3d475fd416b4f4))
* **creneaux:** :art: now just title in planning ([1194cec](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1194cec762f05c74cc4b62740ba261e9c65841e9))
* **creneaux:** :sparkles: add dialog ([720b311](https://gitlab.com/24-heures-insa/overbookd-mono/commit/720b3113d1006cf44ca47e0c377f67c323371add))
* **dash:** 📣 broadcast ([ab78baa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab78baa7a63f29e4a47d4331df95508dc2d58eea))
* **dash:** 📣 close broadcast dialog ([f991200](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f9912000b3240d11b241c1bc8a975b1dd6488d6d))
* **dash:** 📣 fixed broadcast ([a67f71b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a67f71b768aa8fdb1210cd18b2e0948cf2f36b75))
* **Database:** :sparkles: add user migration Hamza ([f47638f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f47638ff110db2c24b73fcf2b007d8a10d15ca8d))
* **dispo:** :sparkles: format de date plus compréhensible ([b36cda4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b36cda4cf4c490172f1111a951ee813e438ab9a1))
* **Docker:** :art: auto fill server name in adminer dev ([c5d07c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c5d07c0430f99201afcca89e6d4435cf19243ec1))
* **Docker:** :rocket: complete docker env for prod ([70b3c5f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/70b3c5f5a970dc8ff6b22615e81d4740beb9be8e))
* **Docker:** :rocket: docker for dev ([018fc58](https://gitlab.com/24-heures-insa/overbookd-mono/commit/018fc58143f0b9a7e17d5a865a122cff4222b584))
* **Docker:** :sparkles: add prisma command ([70d54d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/70d54d99d633c96c8cb332ddb82a43a8944e1c70))
* **Docker:** :whale: dockerfile for prod ([07efb91](https://gitlab.com/24-heures-insa/overbookd-mono/commit/07efb91f798ad17f6b22224688c1b2c08f8a8bfd))
* **Docker:** :whale: some better things for docker ([8b9a906](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8b9a9069524994596050c5e8f5cb3a6b4a061eda))
* **docker:** 🐋 back binding port to 2424 ([2364eeb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2364eeb87ad10e67771469fd9896e7c93cec2dad))
* **easter egg:** 💛 😂😂😂 ([09b0f36](https://gitlab.com/24-heures-insa/overbookd-mono/commit/09b0f368b3d6429feb94dcf3bbf01562608b6c5a))
* **error:** 😐 added error page ([21032e3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/21032e36b28ce5d368d6f7dae823274cb4063e34))
* **fa:**  🔨 fix [#232](https://gitlab.com/24-heures-insa/overbookd-mono/issues/232) ([4db3b83](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4db3b836119377fd8254750ce8c9dc1ddb3174d2))
* **fa:**  🔨 fix [#242](https://gitlab.com/24-heures-insa/overbookd-mono/issues/242) ([8717dde](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8717dde99dba43c58718a7acb4b1a0bc8841c01b))
* **fa:** :sparkles: ft status ([5c0ad06](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5c0ad063e5d74d9d318d7c60d188389ccff6b2b7))
* **fa:** :sparkles: new fa models ([46d5270](https://gitlab.com/24-heures-insa/overbookd-mono/commit/46d5270251b1313cc20cc66abec92231daf35e34))
* **fa:** ✨ FA LAUNCH  [#148](https://gitlab.com/24-heures-insa/overbookd-mono/issues/148) ([91cb449](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91cb449f6cf285dfc40bbe9b677e992a9a27f957))
* **FA:** 🎉 display FAs ([5cc1033](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5cc103347974ed122c603dca8ae916ebd441df2a))
* **FA:** 🎉 get FA config ([710813b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/710813b89b9f6c431cdf324f820bc7179b33d7c2))
* **FA:** 🎨 color status ([ef72c11](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef72c116495f3a034fcef6b07f5aa8fd6af9ae46))
* **FA:** 💡 added equipments ([d09e4f6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d09e4f6576de20b6e15ffd446fecdf85b28013b5))
* **FA:** 💡 added FA routes ([53d97d4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/53d97d41cf63eea40ceeb499c14c3821e8f927fe))
* **FA:** 💯 FA's ID are numbers ([2b231d3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2b231d3ab67e5c012730b839ee1b2e540bd790f9))
* **FA:** 💯 fix [#22](https://gitlab.com/24-heures-insa/overbookd-mono/issues/22) FAs now are identifiable by an ID ([ef8e200](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef8e200674a8fee40d406c11708448a69ea0d2bf))
* **FA:** 📆 added availabilities ([e42be6b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e42be6b90d0dc0dc635d097821470eb0fe3ba068))
* **FA:** 📆 added calendar ([055a883](https://gitlab.com/24-heures-insa/overbookd-mono/commit/055a883f74bc497c93d1638d9a70ceca9b050955))
* **FA:** 📆 added calendar on FA [#121](https://gitlab.com/24-heures-insa/overbookd-mono/issues/121) ([0d5c621](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0d5c6219bee103edcc04f0e197a6677c89103d15))
* **FA:** 📆 close edition on calendar when validated [#121](https://gitlab.com/24-heures-insa/overbookd-mono/issues/121) ([816ce50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/816ce506766baf393b0209a174f20421ce88bf61))
* **FA:** 📑 added dialogValidator ([5133dcd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5133dcd5541b4a2e966ac4e2619389d9be89017b))
* **FA:** 📑 added FA table ([0729c2b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0729c2b60616b06842893a04215661db11cf6c97))
* **FA:** 📑 added new FA FAB ([d851456](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d8514569fa602a0c03a8ae9523ad3786563f2f8a))
* **FA:** 📑 added new FA page ([f7c899d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f7c899dcdb439ec068e6b02409a4ca8e4b46f13a))
* **FA:** 📑 added new FA prompt ([b03adb2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b03adb2b2b440c918f0eaea57b31af2f8b798cd3))
* **FA:** 📝 filter by status and search ([40993b2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/40993b2793e57c37962ee52e477562fe1ba7dfdb))
* **FA:** 🔥 add comments ([ff59a64](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ff59a64e1f3dd9c6797b94cafc7d7474bd11ac69))
* **FA:** 🔥 add new FA ([29874a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/29874a191593e3936c3bf925448e473b4e1fa47c))
* **FA:** 🔥 added firebase ([8b1917e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8b1917e92805db6bae64d77b6ad24a01b3c286ea))
* **fa:** 🔨 added consumables to FA ([01c5550](https://gitlab.com/24-heures-insa/overbookd-mono/commit/01c55509ffc5bf41bed14971f99bf009203c1c2f))
* **fa:** 🔨 fix midnight bug ([62039d5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/62039d5f987c9d8648117f3d3375811d4200be34))
* **fa:** 🔨 request name before creating FA [#147](https://gitlab.com/24-heures-insa/overbookd-mono/issues/147) ([c26fead](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c26feadf31cabe5da7ac43d8e9e834117740811e))
* **FA:** 🤙 added textarea fields ([f268d07](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f268d07c46b9eee34f502989e6f1691d2fad6b09))
* **FA:** 🤙 added TGG ([4fb08ef](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4fb08ef93657a45f3cdd88c612236778bb255e99))
* **FA:** 🤙 availabilities ([32f6f8f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/32f6f8f1e6ae996c14d4e928ebb4ad642246c2dd))
* **FA:** 🤯 filtering by team ([ca79c8b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca79c8b273d814744fc2d6b702508f7318285eea))
* **FA:** 🚚 update FA logistics ([87a1f00](https://gitlab.com/24-heures-insa/overbookd-mono/commit/87a1f00e9998626ebde15d91c5043b494f5a78dc))
* **fa:** 🚨 added pass secu UI[#148](https://gitlab.com/24-heures-insa/overbookd-mono/issues/148) ([f67c2bb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f67c2bb34c123086a5a883e9b9b68237f2fce1e2))
* **fa:** 🚨 overSigna [#147](https://gitlab.com/24-heures-insa/overbookd-mono/issues/147) ([312fc8f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/312fc8f4e1cde6e766915510d6621cbd7930cd43))
* **fa:** assign drive to gear request during validation. [#729](https://gitlab.com/24-heures-insa/overbookd-mono/issues/729) ([f008fcf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f008fcf4d4dcffbac9f8d449e9eed0beb14bff31))
* **FA:** autocomplete and fix timetable UI ([c103742](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c103742657e7dca39fc17b0652a0b2e242454f39))
* **fa:** display gear request drive. [#737](https://gitlab.com/24-heures-insa/overbookd-mono/issues/737) ([07a9358](https://gitlab.com/24-heures-insa/overbookd-mono/commit/07a9358edfef9f79209b0f6e6ed8091a20fe7a29))
* **fa:** handle multi rental period for gear requests. [#716](https://gitlab.com/24-heures-insa/overbookd-mono/issues/716) ([941c06d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/941c06d0720ed4b7cbcfa11b2a2b26092f64da90))
* **fa:** unique gear request timewindow. [#695](https://gitlab.com/24-heures-insa/overbookd-mono/issues/695) ([865a088](https://gitlab.com/24-heures-insa/overbookd-mono/commit/865a088507ea7f5ef426779b05083555837c203b))
* **form:** 🔨 added autocomplete to form ([0ab1c80](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0ab1c808059a1ec7a77fd877f4e48ed3f92b43d9))
* **form:** Input validation in forms and mandatory phone ([605d47a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/605d47a0202557a26b365c2992f03e9286e8918b))
* **friends:** ❤️ friend request are in both directions ([ca29662](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca296622d0854b4e45071b085b261a8b8294fa5c))
* **friends:** 🔨 display friends in the right order ([d94cc98](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d94cc98043b7217faf9f083a5b326a86f9f09085))
* **Front:** :dizzy: adding mini sidebar. [#673](https://gitlab.com/24-heures-insa/overbookd-mono/issues/673) ([0bed0ba](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0bed0ba66ed9056b695cf89ffb47d8c4adac8495))
* **Front:** :fire: Fix filter and scrolling, add future chip component ([3816bab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3816babeb78ad64b6df6d14490ca36b2193f9aa4))
* **Front:** :fire: Fix filter and scrolling, add future chip component ([082928f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/082928f000866d90c630623c1df6b68a293e6dc3))
* **Front:** :sparkles: add global CSS ([6c4da75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c4da757e90cd25638e2358f3a18eb9ac4bb782d))
* **Front:** :sparkles: Add message error in forms FA ([ab38c71](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab38c713ba568b09758597ed89d2dff47cd5b3b9))
* **Front:** :sparkles: Add Total ft store, revise inventory logic for required equipment ([c6b5dac](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c6b5dac4b5ed8c436b622edae56205658c0af784))
* **Front:** :sparkles: Creation of new user list for simplification ([41df8d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/41df8d95bb214350f5aaa803011e0003a329d772))
* **Front:** :sparkles: Creation of new user list for simplification ([6301555](https://gitlab.com/24-heures-insa/overbookd-mono/commit/63015550017827ee7bc92c804cb934d384178849))
* **Front:** :sparkles: Enable edit admin & humain ([ff10095](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ff100950191379557e37d45bd5555a19cac32804))
* **Front:** :sparkles: Page for availabilities edition ([5e0483e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5e0483eb2d418ff1eb9568039180c987091ee2e5))
* **Front&Back:** :sparkles: New all conflicts page, with compute all conflict btn for human ([9acb5fd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9acb5fd64084f633550dd6fb367984d99fc47e6b))
* **Front&Back:** :sparkles: New all conflicts page, with compute all conflict btn for human ([b976391](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b976391bdbd8f6ffdcd83d173cb533494f52d82d))
* **Front&Back:** :sparkles: Now detects availability problems (or at least it should if no bugs) ([c289440](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c2894400f92eab00d5d6de0087599f29b3b232e7))
* **Front&Back:** :sparkles: Now detects availability problems (or at least it should if no bugs) ([f5b13a1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f5b13a1f0c13bdc988b2340666e1a909b8dc810b))
* **front:** adding create activity and task forms ([c35f42b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c35f42b247031c247ecbc35e0c0ae1f9d400c7a7))
* **front:** adding create equipment form ([6e8b8c4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6e8b8c4c365682e2824db71d9b998e068e641e23))
* **front:** adding create event form ([ef0089d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef0089d86a8165452e07a2229f95e0d68e3827f4))
* **front:** adding create location form ([06f5036](https://gitlab.com/24-heures-insa/overbookd-mono/commit/06f503682f3234f2b069916901c27e37b10ae010))
* **front:** adding show activities ([ffc8b73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ffc8b7335ed266a4ab5e14077974958810f05431))
* **front:** adding show equipments ([84dae9c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/84dae9c8ea519b1267eaa59f15e25f72b87a69c6))
* **front:** adding show events component ([eec88a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eec88a3cd2fa116ee3960e4ee6bb245e8a582396))
* **front:** adding show tasks, show users, and detail event ([ec386e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ec386e5f382d9994d72c4dadbf22a8c678f523d6))
* **front:** adding visual info on show components ([dfe3037](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dfe303795ab535dcd854af132f6cf9a605e7ecf9))
* **front:** multiple smalls addings ([120526b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/120526bfa44b767ad5416bb03c955457fd205c14))
* **front:** putting host in global.js ([20780b5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/20780b575a8d92ccc77a1b29bcbae7ec9dd9e403))
* **front:** starting front to test api ([4e30d9e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4e30d9e47d3ee867d778794d101982ec1f44845b))
* **ft:** ✉️ send mail to service desk  [#45](https://gitlab.com/24-heures-insa/overbookd-mono/issues/45) ([0277db7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0277db77cd9b6f7e35b32f2d18a1bcf1976e5ab7))
* **ft:** ✨ new filters ([7aeae57](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7aeae57419b76d9bf22c0c85291ad215cf295184))
* **FT:** 👻 added toast feedbacks on FT ([023e3e8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/023e3e8c8eb899723582441393c37111f1569a18))
* **ft:** 🔨 delete timeframes [#246](https://gitlab.com/24-heures-insa/overbookd-mono/issues/246) ([dc9b966](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dc9b9669586856014feec0a719408c14d47951b4))
* **ft:** 🔨 disable validating if ready and linting ([abe3ac8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/abe3ac80b5235a1fd790a8eeddb551dd3c02154b))
* **ft:** 🔨 fix [#247](https://gitlab.com/24-heures-insa/overbookd-mono/issues/247) ([3010efb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3010efb7d3fe0a36f63f7534d74bd193f7d2ff75))
* **FT:** 🗑 delete FTs ([0ceb039](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0ceb03944631aab27e23d2c950c9ccf01cc882b9))
* **FT:** 🤗 added humans required in FTs ([ce1b2dd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce1b2dd25ca442152789b3bf49f1220c23de4575))
* **FT:** 🤯 FT list ([dd1fce3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dd1fce3473e0020fabf8fbc3d017c3e0f2180c75))
* **FT:** 🥳 edit FT ([b722ead](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b722ead656060cf0d487f4d315bf0eb56e0af928))
* **FT:** 🪞 validate refuse FT ([d2bbf8c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d2bbf8c1a7bcf0db00e1067173df3c5956a2dd57))
* **FT:** 😍 added FTs ([e42bfe3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e42bfe345ef118691975d2132bbd46c2dcb9ad28))
* **ft:** fix generated of timespan generated ([1d7d606](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1d7d6065fcfbe88054ece18d4b827a93b46d89ec))
* **Global:** :sparkles: add nex command & help ([89c22f2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/89c22f2e03597e5c9c5ceebd45642d802d7fc2cd))
* **Global:** :tada: add workspace fil for vscode ([d882bb0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d882bb0d046678678c109f73376049515c7ea507))
* **home:** 📣 Feedback when user has no role ([592e350](https://gitlab.com/24-heures-insa/overbookd-mono/commit/592e3506a10a71b22b149de78c2dd01cc53ede3d))
* **home:** 🤣 update home meme ([c23bdd6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c23bdd6250847631487474ad5fd66013569e2628))
* **humain:** 🔨 fix causing birthdate to not display correctly ([a15d62f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a15d62f75df77147faacfc1d6bb6187075c17087))
* **humain:** 🥳 change nickname from humains ([594a316](https://gitlab.com/24-heures-insa/overbookd-mono/commit/594a316e068e2813a042a43041f42bbcf492dd4c))
* **humain:** 🥳 close dialog upon saving ([0cf3cf3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0cf3cf33f7118b156422552eaf24a85a9584a6ad))
* **humans:** ✨ QoL on humans page ([3f20204](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f202046e18f1f1c5c4e2cd89d3a6dd34db3ed2e))
* **humans:** 📊Added "Export to CSV" functionality for admins ([9f5737b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9f5737b2894833b12e185980851a3855d074d2b3))
* **humans:** 🔨 add and remove charisma [#57](https://gitlab.com/24-heures-insa/overbookd-mono/issues/57) ([ba51747](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ba5174768247aed174d306bbcfa518cd26f479e7))
* **humans:** 🔨 fix filters by role ([848701c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/848701ca8423d99447a59f3a5950e597ac34dfb9))
* **humans:** 🔨 fix filters by searching and driver licence ([b0f2816](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0f281676f7b3af4b55083804f1e8de52a0a8dfc))
* **humans:** 🔨 fix humans filters UI ([81e935f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/81e935fc9081273e013445e68c8c351e5e49f2a3))
* **humans:** 🤗 added info to users ([155d772](https://gitlab.com/24-heures-insa/overbookd-mono/commit/155d772f1510ae37d32f39928081c694362e9f81))
* **humans:** 🥳 added human filters UI ([48439fc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/48439fc2df6db0729fccea5586d1ea8d8192aabe))
* **humans:** 🥳 added not validated filter ([ac7d3f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ac7d3f5eef175a09904b594a2d86bc41920f8a0f))
* **humans:** 🥳 new human role filters ([51dc947](https://gitlab.com/24-heures-insa/overbookd-mono/commit/51dc947da4a7c0ed35eb24142e080e15ca096a72))
* **index:** 👀 not validated orga count in dashboard ([7250bf4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7250bf405260f26238dda2d8a6a192b7175d9427))
* **index:** 💰 display compte perso ([5a33657](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a336575c4f92ec5cd4d748ab38de8f9b8004538))
* **index:** 🔒 added logout if user has no access ([175dbda](https://gitlab.com/24-heures-insa/overbookd-mono/commit/175dbda5709cefddd2b5e05800bd048f87f43fc8))
* **index:** 🥳 started adding index ([1911783](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1911783cb8651a21d0b9df55cc97737465693173))
* initializing nuxt project ([229903e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/229903e11829406f68fc5689b3f21d9235dc245c))
* **inventory:** 📦 open inventory to hard ([08f640b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/08f640be8cf4abbb01094b82390fc26418fe7a50))
* **inventory:** 🚎 updated inventory ([ca181ce](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca181ce5ee5eb97c58db380157228018582017ff))
* **issue:** 📝 added issue handler ([aefff6b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aefff6b278d973230930bffbe30cd42d184a8af0))
* **issue:** 📝 fixed issue handler ([b0000f1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0000f1eac6e648610fe223c58c7f4360d354a72))
* **issue:** 🔨 fix the issues to the US webservice ([0fec37b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0fec37b5cdc6deaaa877caa504633b4dc4de7235))
* **jaune:** 💛 jaune easter egg ([180003c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/180003cfebfb7b225a0490b449616ff4f4744dca))
* **keycloak:** 💌 Send email verification ([6c9ec47](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6c9ec473d6c35eae3cb470abcb0ec9bed292a40e))
* **layout:** 📝 added authors ([79a9b65](https://gitlab.com/24-heures-insa/overbookd-mono/commit/79a9b65c7c77fc711b7f0129705925fd91c1f105))
* **link_front_back:** :sparkles: temporary menu ([d48609d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d48609ddaa725c6789fd1488365fbf0bedb3285c))
* **log:** :sparkles: add inventory export ([3f7c45a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f7c45af1d1a53f09a302e6a82884d1d7c0cc3f5))
* **log:** :sparkles: add inventory export ([d372281](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d372281496002935fd52812e8c0eb6388bda4514))
* **log:** 👓 Basic FA inspection tool ([1fbefca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1fbefca3206da909c635259ede8b179863ea1029))
* **log:** 📦 add equipment form ([5cc2f79](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5cc2f79aabd55d8c9ffd5d76836734dbeaf8158a))
* **log:** 📦 add inventory ([889f305](https://gitlab.com/24-heures-insa/overbookd-mono/commit/889f305917c216441ac11048621425d92e7174e1))
* **log:** 📦 add inventory ([30fae30](https://gitlab.com/24-heures-insa/overbookd-mono/commit/30fae30145e7c362403925558ee82ccfb427e72e))
* **log:** 📦 added inventory ([fd51552](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd51552c9d08ebe0148984325a6ede41e7e4748e))
* **log:** 🔨 fix inventory [#143](https://gitlab.com/24-heures-insa/overbookd-mono/issues/143) ([b90fe4f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b90fe4fa43dc9960fec3d98c3fe7a6832f03d74e))
* **log:** 🚚 added logistics page ([1cad346](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1cad346ce2c506d0b3f2f1cc3456cca435c4d8f5))
* **Log:** 🚚 fixed logistics screen ([0e753ea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0e753eae3faf8d04f56640593afa380be11c32e5))
* **Log:** 🚚 fixed logistics screen ([54221b2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/54221b20cf90a22f02ba54e3aea91bb27e8e8b3b))
* **log:** 🚚 item selector ([9a65ce1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9a65ce187cba7cf6a6c6b4e1994cca02f78de1e5))
* **log:** 🚚 table list ([c0f203b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c0f203b23b7f436de368816a6aee2bb0019f0ecf))
* **log:** Advanced FA inspection tool 📈 ([4487d7a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4487d7ad2278ceef654bfb6e3be2ec99cce9f826))
* **migration:** 🔨 fix build issue ([bc7f0b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bc7f0b836c7ae4d99db3b0d7199c9aabbd6c3f70))
* **migration:** 🔨 migrate signups and QoL ([28b9cd6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/28b9cd6f004fdbd65863eac5817805779047f9e1))
* **migration:** 🔨 migrate signups and QoL ([4af6acf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4af6acfc136cb9d9f67fbbe0c9e91d5dc298782e))
* **money:** 💰 added money transfer ([a92e75c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a92e75c6705a2e2c7c507e2d70cdc0fc22c39d53))
* **money:** 💰 added money transfers and testing ([0baebd9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0baebd9b9253226d3fcf6a422cd232d2fe8d1fe6))
* **money:** 💰 save transaction history ([b557a67](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b557a674d5bb186eecf3cbf54ddd8d0da82b4e36))
* **money:** 💰 update without refreshing ([0b2d8a9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0b2d8a9ce9e62c82e37a0b558ef6f6461154e0fc))
* **notification:** :zap: add a button to remove notifications ([122506c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/122506c2f6a8e43e11dabf85390fa282e28db639))
* **notification:** 🔨 added delete button to ([a6d5c5a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a6d5c5ab72da194dcbe9cf7806b706e97186115f))
* **pass:** 🔒 do not save passwords in database anymore ([6250b2d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6250b2dbcb68200562ca44d19c4cf6cab45cac38))
* **pp:** 📸 added PP support ([fb34024](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fb3402425d06ce86cef05ee2e7206f36c60a82e6))
* **pp:** 📸 delete old pics ([93bde3b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/93bde3bf16ac40791eec3f87fd411e1bb224e6a7))
* **QoL:** :rocket: affect and other ([0052c23](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0052c23a13868449eb503e51181c9432dbbed0f4))
* **QoL:** 📺 display patch note on login ([5a00a59](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a00a59fc2ee9f4c9bd08d2e5be0ec083b207796))
* refactoring populating script ([16e4b93](https://gitlab.com/24-heures-insa/overbookd-mono/commit/16e4b9366cf529121fb82b1eeeb446ad33129312))
* **schedules:** ⏱ set and get schedules ([e02af9a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e02af9a9f0af7e54fd9f2370fce4f593588efa20))
* **security:** 🔒 close backend routes ([a43994f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a43994f6e3c3e2b707a044031690707a9e533e01))
* **security:** 🔒 fix config route [#42](https://gitlab.com/24-heures-insa/overbookd-mono/issues/42) ([5c9d576](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5c9d576b632a69f84a51985535763ad5eaa33fa8))
* **SG:** :building_construction: Begining of transactions ([4eb9906](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4eb9906ffc882806adcdb9f7e69b82b49054def1))
* **SG:** 💰 added modes ([4253573](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4253573efa73c7b51cf6af493f980ed53b72129e))
* **signup:** 📕 finished signup ([f40475f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f40475f7fb96064e0d10f76a4e2f0f8dcd04b29e))
* **signup:** 📝 added form validation ([a79acf3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a79acf3bf7d3529d7f1185db1fea1adadcd605cb))
* **Soft:** :sparkles: custom view for non validated soft ([0821464](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0821464290a417884be7bf190f6435d59faa70d0))
* switch to friend planning. [#545](https://gitlab.com/24-heures-insa/overbookd-mono/issues/545) ([b4297d3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b4297d35431e16499d41619be7ed88d85bdd3112))
* **tinder:** 🔥 added OverTinder ([c503679](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c50367921f6af4752a184d7d1b4a137052c7910d))
* **transaction:** :sparkles: Add expense handler ([2f4ff41](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2f4ff41f4fca1bf87908d147edf27c9e7ad080dc))
* **transaction:** :sparkles: add transfer handler ([eb0c894](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eb0c894eda17267e7f558a2ca269d66478801748))
* **transaction:** :zap: Change deletion method ([3c20e3a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3c20e3aba6e410938e513b05252b565624ccda3d))
* **transaction:** :zap: use prisma transaction to update users ([b24e8fa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b24e8fa1dcb01d842a2a22cc7492d6896c27327a))
* **Triage:** ✨ new triage rules ([dec9c77](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dec9c77fcdecace40d9596bf9883ab1b83614769))
* **trombi:** 🎆 added trombinoscope.vue ([958fa4e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/958fa4ed845bb2efe1a7d765dfa438948f8bd23d))
* **UI:** 🌙 persistant dark mode ([30b2f70](https://gitlab.com/24-heures-insa/overbookd-mono/commit/30b2f7021da400b98fcda220327eb52d45b0e48e))
* **User:** :art: add password verification on backend ([acd2038](https://gitlab.com/24-heures-insa/overbookd-mono/commit/acd203843991d28a10cc54ac0d072b52fc6af5d6))
* **User:** :sparkles: add user controller from hamza + swagger ([f049f75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f049f75f0c0af4030945cce26d27d2a679ff086a))
* **User:** :sparkles: add username dto ([6d1d2e0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6d1d2e00813bc9a59ced23b710353a8de8433896))
* **User:** :sparkles: Add userservice Hamza ([f2ffe6f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f2ffe6fc2e95c100093772211ee36e29be18b4a7))
* **User:** :sparkles: signup works again ([dc1bbda](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dc1bbdaa18807d69aaef3cdc33c36f4291c86809))
* **user:** ⏱ check old FAs ([cbf846d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cbf846db8121491573f406e6e20d7815bd3f9c87))
* **user:** ❌ display validate button only for validators ([b016b9b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b016b9b465563aa557e0364faeb7162511f1f38b))
* **user:** 🤙 better comments ([c77ceaf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c77ceaf3366b02d339b7ad26f807e14445150789))
* **user:** 🤙 validate and refuse FAs and comments ([a59df9b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a59df9bf5c3da7557eda2299407181bd4309b083))
* **user:** 🫀 fixed user field ([c273d57](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c273d57094812a3a45ef876384a28c27ac917607))
* **utils:** :zap: add setter fa & ft validators ([82bd8f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/82bd8f52218c8dfbfe0587f1accf8c4196816f94))


### Bug Fixes

* :ambulance: Change nuxt config to match new back ([0ea8396](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0ea83962d6f7c230d3720a891c91f3b3567a27ff))
* :ambulance: correction du mail ([19e8c19](https://gitlab.com/24-heures-insa/overbookd-mono/commit/19e8c19ae34d10d937c5737d5d5a64bdbac3d6f3))
* :bug: fix cors ([7898919](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7898919402599bd61bda505df480e6ff3d656b43))
* :bug: fix jwt strat ([bf0299d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bf0299da85f54b2ff2d75f7491d2bddb221952a3))
* :bug: fix migration location script ([608fa67](https://gitlab.com/24-heures-insa/overbookd-mono/commit/608fa67da107fb4f8b23577307df2fba3b851cd6))
* :bug: Suppression de l'appel /logout lors d'une déconnection ([79e3d69](https://gitlab.com/24-heures-insa/overbookd-mono/commit/79e3d691da4190257ad9eb81a56e9d8b5cc28ee3))
* :zap: add filtre to have only signa location ([c5ff423](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c5ff4232dd097eb974c4658a1065af7822e30819))
* 🔨 fix bug causing prod to not build ([28dd3a9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/28dd3a9044e59a2749850d94e6ba024d55dfbab1))
* 🔨 fix bug causing prod to not build ([6140968](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6140968c9f54250fceb171ccb8cea18f3321dafc))
* 🔨 fix bug requiredAction ?? ([c12f29e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c12f29e975955ecf6971eec5ed561dd4b7fe0923))
* 🔨 fix for mr review ([b0f3cbd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0f3cbd4df0b4a374f09e2939eeea0ecd41e15a1))
* 🔨 fix MR review ([e177f88](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e177f889424c349bb9e2582784e3548a5c42679a))
* 🔨 hot fix bug causing ft to crash ([ee7f78c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ee7f78c639418be3dcba8ba4721cba3d152c4464))
* 🔨 missing ul close tag ([9e40f51](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9e40f51e9640ec253c7992bb367dbf3da3f7071d))
* **affect:** :bug: fix user not display ([ee98693](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ee98693e5b01c38e326b91482de8651141be8f93))
* **API:** 🔨 display required fields ([75d4c66](https://gitlab.com/24-heures-insa/overbookd-mono/commit/75d4c66e5f08a15996f0c66b18fe8fb37d68e9c0))
* **API:** 🔨 fixed API url ([4093728](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4093728208eef2faeedca320572cc4420194bfb6))
* **API:** 🔨 fixed size of transaction history to 3 ([cd6f971](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd6f97141e7ae2e639063ca4639a6ec33e5c4b69))
* **api:** minor typos in requirement ([4a948de](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4a948de83c4c4e92797121f995783bf863643627))
* **api:** refactoring supervisor parameter to have the same name everywhere ([ab0c07c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab0c07cf6c29d989c820aa7ef4202ddba85b40ec))
* **api:** wrong route for notification/team/:team_id ([0a22a67](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a22a67e31a3f1fab97949c2a2b215ae7646d91f))
* **appweb:** fetching map tiles in https instead of http ([a465d11](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a465d115e73ed8e0b028a66cdc290fc8270a20c2))
* **appweb:** fixing config file missing causing build fail in d1c7f7c ([81d6539](https://gitlab.com/24-heures-insa/overbookd-mono/commit/81d6539e8c69e809d18e786c18815d279312bd7a))
* **appweb:** fixing drawer not opened by default on bug enough devices [#18](https://gitlab.com/24-heures-insa/overbookd-mono/issues/18) ([f642ec5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f642ec5b33215d2b9f1b0663837ed3e3d07829f7))
* **appweb:** fixing footer being over buttons in smaller devices [#16](https://gitlab.com/24-heures-insa/overbookd-mono/issues/16) ([0c9c2ca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0c9c2ca8abfd0292ba6fbe6fc3b763e13b09ec5f))
* **appweb:** fixing map showing over nav drawer in smaller devices + fixing footer size ([bd10b25](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bd10b25551fdcf8b4dc794e523c2ce99af80e717))
* **appweb:** fixing navigation drawer opening in smaller devices [#17](https://gitlab.com/24-heures-insa/overbookd-mono/issues/17) ([8760330](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8760330016a6ec9c3d9db4632407b4be2397d310))
* **appweb:** fixing security issue ([881f429](https://gitlab.com/24-heures-insa/overbookd-mono/commit/881f4293f3b869a9bdfbdbbe6d9658b1c5be8ad8))
* **appweb:** fixing the way the content appear ([4c67120](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4c67120ac5495c0ea59d286532b469ad282644ed))
* **appweb:** fixing the way the map is displayed in location creation form [#15](https://gitlab.com/24-heures-insa/overbookd-mono/issues/15) ([3f14d88](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f14d88b41537086af6b820523f3ed81e50fdf56))
* **appweb:** fixing the way the map was displayed in the location card [#26](https://gitlab.com/24-heures-insa/overbookd-mono/issues/26) ([5623e77](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5623e77cebd1afa44286bc1c716ab1fdd2bda509))
* **appweb:** fixing url push in edit, affect buttons ([f743137](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f7431371b1d9116764052aa2273b1e771ab8226b))
* **appweb:** fixing validation problem [#3](https://gitlab.com/24-heures-insa/overbookd-mono/issues/3) ([f30a7e0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f30a7e05cf3d2aae7695fa430127fe275e35043d))
* **appweb:** removing looping request ([9607210](https://gitlab.com/24-heures-insa/overbookd-mono/commit/96072109f12d5065f0ee01520aba232b72e9874f))
* **appweb:** removing looping request ([92cfa35](https://gitlab.com/24-heures-insa/overbookd-mono/commit/92cfa35ac89e278902b2a8191b182937960a3d54))
* **appweb:** Set nav bar to fixed position ([cd0d662](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd0d6622b6d5cf97627a32be6eee0d80e6b3337c))
* **appweb:** uploading files for user with data form [#3](https://gitlab.com/24-heures-insa/overbookd-mono/issues/3) ([3f36ec5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f36ec5bcb7ad78d10065d59d56cf607d7c23067))
* **assignment:** :wrench: allow right click on entire event to open details ([ea55402](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ea55402b06c0c963a82d634d239b27c348f308a0))
* **assignment:** 📆 added calendar to assignment ([35dab6a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/35dab6a7b80ae088b5939ca2b95b18259567041c))
* **assignment:** 🔨 fix bug causing assignment to crash ([5c860aa](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5c860aac24e2e1c716774296dcfc33c7775b5eae))
* **assignment:** 🔨 No need to refresh to update [#329](https://gitlab.com/24-heures-insa/overbookd-mono/issues/329) ([9ee0fbd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9ee0fbd628caaa23df32f3d3cc750568d16009f4))
* **assignment:** 🔨 No need to refresh to update [#329](https://gitlab.com/24-heures-insa/overbookd-mono/issues/329) ([2022eea](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2022eeab5ba1f7887f5c541263aaf89c04a8d9bd))
* **assignment:** 🤩 save assignments in local variable ([37f649b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/37f649be85e542a57d9027aeb1b793df42e39e0c))
* **assignment:** 😀 added feedback on saving assignments ([22c5da3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/22c5da3f0c99ce87be1354c373f3a3346f43a1a2))
* **Auth:** :bug: minor changes (config, dto) ([50dda6c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/50dda6c53b5cb07cb181fdc9f69dd1fb319700a7))
* **Auth:** :zap: 1 day expire sign ([6aa6d57](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6aa6d577f5014244fc2407689fff3efd04c043ed))
* **Auth:** :zap: use hash from services ([9fd0c49](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9fd0c496f0010c5856a0d141d0be5550400dc0d4))
* **availability:** 🥳 fix availabilities roles ([ea87265](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ea87265402958210887dac53d56b6e58662f5256))
* **availability:** 🥳 save button and fix charisma ([d6b59c0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d6b59c06b0fc2c247d27057f843ac90dc81955aa))
* **availability:** 🥺 QoL fix of availabilities ([675ea70](https://gitlab.com/24-heures-insa/overbookd-mono/commit/675ea7038dd60af5e4a24020b274b0445d0f87eb))
* **axios:** 🔨 base url fix ([47e2393](https://gitlab.com/24-heures-insa/overbookd-mono/commit/47e2393199d5a35c1108a4e825f4bdad9baea323))
* **Back:** :ambulance: correct key for jwt ([ef81a26](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef81a26270225b396eeb378ae36170a032bab8ce))
* **Back:** :ambulance: update CORS domains ([1600f8d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1600f8d16e049cb74574bf896d76d5c2c11814df))
* **Back:** :bug: bug fixed non conventionnaly ([3646d3f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3646d3ff0bf50eb9a3c2e24f1492ba850d8a497f))
* **Back:** :bug: bug fixed non conventionnaly ([90efb39](https://gitlab.com/24-heures-insa/overbookd-mono/commit/90efb3999b0b39a1755c15c471939690dd69ab83))
* **Back:** :bug: conflit once again ([2ab4d76](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2ab4d7668b515554fd10ee5ff99a8103d8e71669))
* **Back:** :bug: fox type problems ([27ce655](https://gitlab.com/24-heures-insa/overbookd-mono/commit/27ce65558e7e71e77652fcc3ed73e2a43c45942a))
* **Back:** :bug: Hotfix charisme, n'est plus infini ([067beb3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/067beb3de674d8f3e84ea538614146339aec043e))
* **Back:** :bug: Les conflits mitoyen ne devrait plus etre un pb ([1d3dcb0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1d3dcb03b55b73cabaf923ae507cfcede8ac2b60))
* **Back:** :bug: Now don't send alreadyassigned timespans ([8fb6d73](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8fb6d735717673dcd209e71e40b23ddfa287aead))
* **Back:** :bug: Now sends all timespan (even fully assigned) ([a3b4f0c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a3b4f0cd796b4c19f0e2711195214e85db9cbb3b))
* **Back:** :bug: Pp now works ([3e64f24](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3e64f24e34dd30bd0666c1afc8f8903a78ac483c))
* **Back:** :construction: adjust user dto ([7ba6115](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7ba61159af796aa986a73042dfa71e6d65144f92))
* **backend:** :bug: fix typo in DB ([3504c45](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3504c4546147d77ab700c7d3c45e1be4a9453e9e))
* **backend:** :sparkles: change login payload to match users ([68e15e6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/68e15e63c4ca3f21d797fc2f5e46ad93bc41d94a))
* **backend:** :zap: change default for isvalide ([90e4c7a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/90e4c7a0ee664ce7a2087aad4a4fcea64188dc60))
* **backend:** :zap: fix usertransaction ([fc02317](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fc023172c03b4a9c74b2b7abdb3e389ce945625c))
* **build:** 🐳 rollback index.d.ts ([34f5560](https://gitlab.com/24-heures-insa/overbookd-mono/commit/34f5560c052a5983064e778034e6cc4d362e6754))
* **build:** 🖋 correct docker tags name ([4533e4f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4533e4f950b543c41a775e0403f1dedcd542111b))
* **build:** 🖋 correct docker tags name ([0a37226](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0a37226d332cbaf4bd1245b2d54f581580c732ee))
* **calendrier_dispo:** :zap: centrage du calendrier sur la manif ([b28288d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b28288d3a338da3b13dd65e14e6a535af4e0ec85))
* **catalog:** :wrench: delete gear and display category path on autocomplete ([5a8545a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a8545a983a007519d25709b27b6c5dc8168b8e0))
* **catalog:** :wrench: gears filter ([7fe4810](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7fe481072ff2621d4fa437983e08ff37d8824055))
* **catalog:** display category path on gear listing [#670](https://gitlab.com/24-heures-insa/overbookd-mono/issues/670) ([dba5566](https://gitlab.com/24-heures-insa/overbookd-mono/commit/dba55663dae32ad7c257f69b87b315b0358a3892))
* **charisma:** 🔨fix charisma ([e0e997f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e0e997fcdd34b979a79223c36f8447a3b0be795a))
* **ci:** :adhesive_bandage: fix build + add tooltip on teams ([3749f20](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3749f20c3ff372aa9d9457c36165ac1fb0cd291f))
* **ci:** :ambulance: correction in tests ([ae29a37](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ae29a375215a955160829ddb1e33391a29d50808))
* **CI:** :art: missing configurator stage ([a6882b0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a6882b037c363dcca0b391d9ee7b2d7d47cacf2f))
* **CI:** :art: Missing workflow ([ebf66d6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ebf66d6976a0aae544cefa53aaae39ef2f94ef39))
* **CI:** :bug: none trigger subdirectories ([04c2f3e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/04c2f3e36877cb3c6f75613192d1987041cce85b))
* **CI:** :bug: none trigger subdirectories ([51d777e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/51d777ea7d7ad42058f44f1cd0eeb59a85a52e84))
* **ci:** :bug: oublie d'enlever le before_script ([daaeafb](https://gitlab.com/24-heures-insa/overbookd-mono/commit/daaeafbfd3ba675a80e088f316023b75fe8009ea))
* **ci:** :bug: oublie d'enlever le before_script ([9f30e75](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9f30e7568417ba34c01970c33c6321a344a372dd))
* **ci:** :green_heart: clean up pipelines ([b44bf3c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b44bf3cd85c2e1033088d916fe4b2409ddfee8a7))
* **CI:** :green_heart: now all subdirectories are check ([aa4c1d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa4c1d23621c5ecdf64ecffddd5ded43f72c912a))
* **ci:** ✨ keycloak and base url var ([ba714d7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ba714d71169f78780ef4c8985a7dca06fc5fc841))
* **ci:** 🏗 Add build var in dockerfile ([db074a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db074a2678dbc91c907081f3352f00d5d9be0055))
* **ci:** 🏗 take in count env vars in build ([e0d29ed](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e0d29ed2cc400a8da21ff794047252163dbe9102))
* **ci:** 🔨 do not build on 32 bits devices ([f40fb17](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f40fb17e3dd457e27a0e57febb663a58a92d60f1))
* **conf:** 🔨 admin username is env ([6ae0608](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6ae0608936f31a06f891a33a2398c8621b34fd67))
* **config:** :recycle: regex + typo ([aa8fba4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa8fba46fa36a16c6369841d755e8d88b6d20560))
* **config:** 🔨 change encoding ([44a86d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/44a86d2188fa67565d670d6ee0b9ec4e0445a259))
* **config:** 🔨 fix [#311](https://gitlab.com/24-heures-insa/overbookd-mono/issues/311) ([45eaa41](https://gitlab.com/24-heures-insa/overbookd-mono/commit/45eaa41c2c0a43674e746db8e4208c522f57fe29))
* **config:** 🔨 fix \ in regex ([b22fc21](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b22fc211ed9b4e45fc15e8e072bd5f73792acd3e))
* **config:** 🔨 fix friend notification delete ([7befec3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7befec3f78471768c50f2913790379baffec26d0))
* **config:** 🔨 fix illegal escapes ([cdc4244](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cdc4244386d7eb42bf3cd0dbc1d08039f80de068))
* **config:** 🔨 remove secu as ft validator ([3974ae4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3974ae4bf6e9ed6ec2c1eca0bb7b816fbb188332))
* **config:** 🔨 split dev and production env ([c87a801](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c87a80184e27f4b685b37d9daf97e31217302057))
* **conflits:** :ambulance: mitoyen ([49b8737](https://gitlab.com/24-heures-insa/overbookd-mono/commit/49b8737f36c25c961ad05b9adb9f70dbccfa7ce3))
* **convention:** 📘 added config files ([e657f7b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e657f7bb5a420eae15da1c36c21afd0dd935b3ae))
* **cp:** :adhesive_bandage: only user with cp in transaction list ([2e0cde9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2e0cde9c8761322a39c593757f3ed40f80a56753))
* **CP:** :bug: fixe amout to 2 ([f9aa489](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f9aa4897317bd9ad551c13d9c817ce137a6f85a4))
* **CP:** :bug: update with undefinded object ([b9982f4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b9982f4c12673ab81c8e7b02843ea240d8aa7542))
* **CP:** 💰 QoL ([8ac7b50](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8ac7b509d43ea9d9091aac7696c136c99cf5aaf9))
* **CP:** 💸 update balance ([fd47ba4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fd47ba40efc9236ef7b3ea91e456f5174ba3d6b8))
* **CP:** 🔨 accept , in transaction [#55](https://gitlab.com/24-heures-insa/overbookd-mono/issues/55) ([900b732](https://gitlab.com/24-heures-insa/overbookd-mono/commit/900b7325204b06a29e3ea363fc4be220d7157bc5))
* **CP:** 🔨 fix bug causing CP to not work ([10330fe](https://gitlab.com/24-heures-insa/overbookd-mono/commit/10330feb5dc27f526551d97418c851830182cb35))
* **CP:** 🔨 fix build issue ([30ff603](https://gitlab.com/24-heures-insa/overbookd-mono/commit/30ff603eda4bb5d2bf02159ec5f3acb872939eeb))
* **CP:** 🔨 fix CP ([eace4cc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/eace4cc449b9fcc5157a64c1122400369674c287))
* **CP:** 🔨 fix rounding CP ([cd4583b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cd4583b8fd698cd789db0894df113cce6bbde8c6))
* **CP:** 🧹 fix package-lock ([91f58b2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91f58b2e0d7abd282e0f92eae1f591f1abd43fba))
* **creneaux:** :adhesive_bandage: remove page to hard ([91a920d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/91a920ddb40feeeba0f2f6a15e2ba8cb27954522))
* **creneaux:** :ambulance: remove access to hard ([c1a326f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c1a326f311946efc917f56679565f8de9b2215ee))
* **Database:** :art: improve schema prisma for transactions ([0938b22](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0938b22b58b86aab35d48453908f1291961c5246))
* **database:** :card_file_box: change connection methode for the database ([7148b0e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7148b0e18dcc72569ca87acc47bfd5fc8c65ca59))
* **Database:** :zap: change db to snake_case ([8e52e1f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8e52e1ff3c0d22e680da1fec1bb7968f751d59e1))
* **Database:** :zap: update dtos to match snake case ([04ae0a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/04ae0a026f5e2ba5f1948a21c407d0c7ce65e95d))
* **Docker:** :ambulance: change start:prod script ([7e58669](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7e58669004304db54c81ea4d4c2515df7380ce36))
* **Docker:** :ambulance: old backend container now work ([9610542](https://gitlab.com/24-heures-insa/overbookd-mono/commit/96105429dc31de2fe81a5bd93f201076fb38d225))
* **docker:** :art: add TLS to traefik ([0295a79](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0295a7910b968b4b0ede21d1ce833a7c41fa2775))
* **docker:** :bug: path to images ([ce62cab](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ce62cab3633e1e0109dd26f5344a2e828cdb57d6))
* **Docker:** :bug: remove sentry ([4025ea8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4025ea8c51daf6c3fff426d335bc6062459bd383))
* **Docker:** :rocket: Automatique migration with new version ([2d5c9ca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2d5c9ca4c63e4f4f84a7c923bee7f219e194ab5c))
* **Docker:** :whale: correct port ([43722b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/43722b8ee145d70b06f2f43985d0161fe2b95803))
* **docker:** 🐋 missing && ([6b33a5b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6b33a5bc246049990e43a2e93af4f1bed97cb971))
* **Docker:** 🔨 DockerfileV2 and use config file [#1](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1) ([2e5537c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2e5537c1ad252beae0ca57baa6ba2798cfcd5cbd))
* **Docker:** 🔨 use config file in httpService.js [#1](https://gitlab.com/24-heures-insa/overbookd-mono/issues/1) ([ef4a5a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ef4a5a0659cb1818bfa0fc4a3fcb0f74103fab1d))
* **docker:** API container restarting in boucle ([5ddbf6b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5ddbf6b0e3bd3ae95e82731509c48b4c9289c382))
* **Docker:** Dockerfile adaptation for TypeScript ([1121ec8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1121ec8aad807b5d759152af5fad0ce97524013e))
* **Docker:** npm ci to install ([64b67cd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/64b67cdf4cd9a7a9edf1c9288edf5fac5e232dd5))
* **export humain:** :adhesive_bandage: humans now have acccess to csv export ([f8dd3b0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f8dd3b05279dd1ee645dd2016be82e105f100198))
* **Export Planning:** :ambulance: fix fix ([bdf73e6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bdf73e66e300c9cf1de5c8b9f337f312c905a05d))
* **exportPlanning:** :adhesive_bandage: remove unuse import ([b2d0412](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b2d0412ab366a83f51a7b4b78d3cbc0c0a1c28a7))
* **fa:** :adhesive_bandage: color for deleted FT ([af70ccf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/af70ccf3c8b3c9c2b2b3767128fa198824eb14f3))
* **FA:** :art: fix bottom bar from right ([7108a97](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7108a97358dbb31b665fb85225f9741e77b02033))
* **FA:** :bug: la touche entrer ne refresh pas la page ([bb7f01b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bb7f01bd0354c0ee5c6ba2ba366dd3bb4a0da6ef))
* **FA:** :bug: validate & refuse button only on submited ([f1bd014](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f1bd01477da1a8d51de52d91ef52fbfb8794cb4d))
* **fa:** :recycle: email signa typo ([47f24d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/47f24d22312fe1a9e7a5dff07f02cf3f391e3542))
* **fa:** :zap: FT in FA ([7d8fbc6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7d8fbc64e30dd26fe3cde2e3eea794a6450573d8))
* **FA/FT:** 🗑 remove timeframe fixed ([188f6bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/188f6bdd11261108223e901e689856429355ff14))
* **fa:** ⏰ fixed timeframes bug [#235](https://gitlab.com/24-heures-insa/overbookd-mono/issues/235) ([303db54](https://gitlab.com/24-heures-insa/overbookd-mono/commit/303db543dc28dfcccb18e58f0502768e4a478347))
* **fa:** ✨ hot fix and grammar check ([4e542d3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4e542d3d4d0bb14896fbb98cd29cb9f52e95ee84))
* **fa:** ✨ hot fix and grammar check ([a4e06e7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a4e06e7d7e8474db1758c11a978d5b2ceeaa402a))
* **fa:** 🔨 added types on log ([237c024](https://gitlab.com/24-heures-insa/overbookd-mono/commit/237c0247747d71e4b3450832f1e65a047b4a505a))
* **fa:** 🔨 dix elec needs FA [#230](https://gitlab.com/24-heures-insa/overbookd-mono/issues/230) ([9e05c2e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9e05c2e701da29acf3f679852fa5ce76aa1242f5))
* **fa:** 🔨 filter by deleted FA [#231](https://gitlab.com/24-heures-insa/overbookd-mono/issues/231) ([db8e04b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/db8e04b5a11ee491136f55e74bb31c1e3f99acab))
* **fa:** 🔨 fix compilation error ([1653528](https://gitlab.com/24-heures-insa/overbookd-mono/commit/165352856cc65707ce84c7ffc2e7a8ca393fc758))
* **fa:** 🔨 fix creating FA [#131](https://gitlab.com/24-heures-insa/overbookd-mono/issues/131) ([197ec63](https://gitlab.com/24-heures-insa/overbookd-mono/commit/197ec63150984b9a4cdc5694b4913c9df88d8ce6))
* **fa:** 🔨 fix double creating FA ([d05436c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d05436c5f42bfa0b3d699ef8bc7652df2595663a))
* **FA:** 🔨 fix FAs with no FTs not displaying correctly ([bb9da98](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bb9da985961ba30cc1e182bf484bc5dcb1040846))
* **FA:** 🔨 fixed equipments FA amounts + borrowed ([a57e89d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a57e89de5d328b82445b38d7a8731e4f72670fee))
* **FA:** 🔨 fixed equipments FA saves ([224b703](https://gitlab.com/24-heures-insa/overbookd-mono/commit/224b703045819bb5218c6ac864eccbc2c925624c))
* **FA:** 🔨 fixed FA name ([f266cd7](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f266cd74e33f0d14d170996c880f06eb0060ab6b))
* **FA:** 🔨 fixed FA route ([4d7962c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4d7962c8a622b5e7c336272e47f35bf075fb8f04))
* **FA:** 🔨 made teams field coherent ([a2727c4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a2727c40e51ab87b3bbbc2ed77c0e393d6169f24))
* **fa:** 🔨 resolve [#473](https://gitlab.com/24-heures-insa/overbookd-mono/issues/473) ([867559c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/867559c1580cc4fb73c5a095275f215155d1fc67))
* **fa:** 🗑 delete FA handling ([b66e290](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b66e2902eee959d7c71aa7e3223f234d7dcd533d))
* **fa:** 🗑 delete FT handling ([3075b40](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3075b40f2fcc04bca94513c5aa4c3b9785c5d07e))
* **fa:** approve gear request. ([15919a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/15919a3065d56b8002ef0a69271c17d3221c10c6))
* **fa:** approve gear request. ([14fcf71](https://gitlab.com/24-heures-insa/overbookd-mono/commit/14fcf714f9644cd77f756a2cec30730bf4ac97a3))
* **fa:** ask for validation save fa. [#680](https://gitlab.com/24-heures-insa/overbookd-mono/issues/680) ([8b4b73d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8b4b73d71572965edf6aa8f1e4960c2ffba9e0c1))
* **fa:** cast quantity to int. [#667](https://gitlab.com/24-heures-insa/overbookd-mono/issues/667) ([123cecc](https://gitlab.com/24-heures-insa/overbookd-mono/commit/123cecc48b3ad22e50ea850ac4539308345b281d))
* **fa:** ctas display. [#678](https://gitlab.com/24-heures-insa/overbookd-mono/issues/678) ([5669c2e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5669c2e3a5d8f1e13d19cd055bb507aaffba97f4))
* **fa:** ð added unassign route ([e79008f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e79008f0a5414d5a469e7d5610d0af05534a5b9d))
* **fa:** delete a unique gear request. [#743](https://gitlab.com/24-heures-insa/overbookd-mono/issues/743) ([124c2e0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/124c2e08e429403fc6b32ce5ce0a045ffbed5012))
* **fa:** display float btn on fa. [#678](https://gitlab.com/24-heures-insa/overbookd-mono/issues/678) ([baae34a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/baae34a4fd8788d33dae585c4aa0cb172159fb60))
* **fa:** double comment. [#684](https://gitlab.com/24-heures-insa/overbookd-mono/issues/684) ([19d7919](https://gitlab.com/24-heures-insa/overbookd-mono/commit/19d7919c92f61efcbf59e3296661c3934389e470))
* **fa:** filter on deleted fa. [#723](https://gitlab.com/24-heures-insa/overbookd-mono/issues/723) ([ad91f41](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ad91f41c40e3fe4906d0d51a266dc96d20bde6a7))
* **fa:** is-valid with gearRequestPeriods. [#716](https://gitlab.com/24-heures-insa/overbookd-mono/issues/716) ([467a593](https://gitlab.com/24-heures-insa/overbookd-mono/commit/467a593c6d43da6de1534a2de76c177c01524b1c))
* **fa:** order fa by id. [#687](https://gitlab.com/24-heures-insa/overbookd-mono/issues/687) ([e7ac8e1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e7ac8e14445d3bbbbf60f7e8e3952ac5f69f3ef9))
* **fa:** save comments. [#704](https://gitlab.com/24-heures-insa/overbookd-mono/issues/704) ([5a450ff](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a450ff5813bc474b5fdd3c1c1b650999fba8d74))
* **fa:** team filter [#686](https://gitlab.com/24-heures-insa/overbookd-mono/issues/686) ([b0aea9f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b0aea9f2ed34f580266fdc99cc4fb5d5ec6c4a4f))
* **fields:** 🔨 trim strings in fields ([1bc02df](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1bc02df52957be086b93df2006e29a61b33e25d4))
* fixing security issue wih minimist version ([5a8e371](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5a8e37136a94fef10cc4aa0cc1b9b705f1c4d154))
* fixing security issue wih minimist version ([bf6fa96](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bf6fa962ebbb3c38445b787d76ccf3ed0de5be50))
* **form:** 🔨 fixed field labels ([4c765b8](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4c765b8d0bb49ce66d7f1f2523e8c9824366d4dc))
* **form:** 🔨 fixed values ([3bc293e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3bc293e739ffa560d85b502569ef4d36bdeffcec))
* **front sg:** :ambulance: change Permission for button, Change round ([35632e0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/35632e0bc0b75ced6ea10cd2640a042667b682b3))
* **front sg:** :bug: replace _id to id ([aa39a4a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa39a4a8eeeb0c61f00f89066d2b1bb049b287f4))
* **Front:** :bug: clear date format variable. [#690](https://gitlab.com/24-heures-insa/overbookd-mono/issues/690) ([bc4a09d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/bc4a09d7b5c72950d544f8aca89d25950797c153))
* **Front:** :bug: Correction logic tri des teams pour ft ([516ef4d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/516ef4d3083fd01d076b6062500571cf4125b1c7))
* **Front:** :bug: Fix champ number ([3f45604](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f4560412bc2f7a45ed95adee7e948364c68207e))
* **Front:** :bug: Fix name validators + title margin ([f9141b9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f9141b937be7f7682c1f96f5ee6ab08153742092))
* **Front:** :bug: Qui a changé ça ??? ([14175be](https://gitlab.com/24-heures-insa/overbookd-mono/commit/14175be200c0a2e57db8f8532bc5af5dda8af338))
* **Front:** :bug: Qui a changé ça ??? ([b76544f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b76544faaf3998a9aa6f954c525f6096353d46d3))
* **Front:** :bug: Remove btn Soumettre if VALIDATE ([54e346c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/54e346ca5321fbfa7a5333449d2c4d9e6eaa2f0d))
* **Front:** :bug: should maybe workWatermark + reduce ft tabs length ([9c3e6a0](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9c3e6a0b25c95e2a94a0db0219e2505d747211fe))
* **Front:** :lock: https instead http ([25f8429](https://gitlab.com/24-heures-insa/overbookd-mono/commit/25f8429583bcf6a20c348471ab62448bfee427a0))
* **front:** :zap: change mon planning -> orag requis ([77f551c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/77f551cc7122336d989b7ca1afefc2260fb3cd23))
* **front:** :zap: change mon planning -> orag requis ([e6d8b62](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e6d8b626b1a25b7a8645ae0275f3884c56f0e70d))
* **Front:** 🎨 new user team adaptation in sg vue ([aa16643](https://gitlab.com/24-heures-insa/overbookd-mono/commit/aa166439d194b63f8bf291b73f9905ec48591d54))
* **Front:** can't unnafect required guys ([77eff56](https://gitlab.com/24-heures-insa/overbookd-mono/commit/77eff569f129ce76ce174a6af1d176abe6aec3d5))
* **frontend:** :zap: Little fixes to match new datas ([12e45ca](https://gitlab.com/24-heures-insa/overbookd-mono/commit/12e45ca1415195e15f75fc4fa23999254aec9dad))
* **frontend:** :zap: remove unused components for signup time ([5b4cd39](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5b4cd39e31f642f9aac733ff9b4e14cc472a2834))
* **front:** signup page. [#640](https://gitlab.com/24-heures-insa/overbookd-mono/issues/640) ([60f6597](https://gitlab.com/24-heures-insa/overbookd-mono/commit/60f65979da1e011e142cf8be5fa6623042df59d2))
* **ft:** ⚠️ fix ready for affect displaying for everybody ([84458cf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/84458cf49525465818f41273fe22dc7be37fb397))
* **FT:** 👀 fix FT validators ([5e13611](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5e136110d3dcb48e38f8ba40d77a3dfe8ed508e9))
* **FT:** 👀 fix timeframe UI ([97e80e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/97e80e504c51bfddb6aea53b8818a7ef8e997f4a))
* **ft:** 🔨 correct bug ([673136d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/673136d3973764a9eb8044ea529b97d273851a30))
* **FT:** 🔨 fix FT table ([8053a6d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/8053a6da08452b941ce9667b2c6e2cd88bb78edc))
* **ft:** 🔨 linting ([34a16bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/34a16bd917e4eade87ae23fd3413d4c2eeea4613))
* git history and move /dist/src to /dist ([af2e364](https://gitlab.com/24-heures-insa/overbookd-mono/commit/af2e364299b01feabea88ce59b353d2e1ab50b39))
* **humain:** 🦮 added role ([f904a46](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f904a46c6eca52a0ae8478ed7be71cf4aac1b54d))
* **human:** 🔨 fix human updates ([913a4e4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/913a4e4bda00f3a2699c602d3927b9b1e215fdbb))
* **human:** 🔨 fix human updates ([2a564a2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2a564a23258cdf523efb7fde28366332625fe870))
* **humans:** 👽 fix humans birthday ([18b26e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/18b26e5fd6ac227ed41e1e90ed5c050ca45f0f51))
* **humans:** 🔨 revoke roles [#10](https://gitlab.com/24-heures-insa/overbookd-mono/issues/10) ([897a6a3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/897a6a3004f8cb037cde8bfbb40ec737eff9b915))
* **humans:** 🔨 search in humans [#59](https://gitlab.com/24-heures-insa/overbookd-mono/issues/59) ([5535c95](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5535c950a133812b38dea747ee7a583a282186f0))
* **humans:** 🤩 QoL ([b06e65e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/b06e65e02da97e01c6808b5f28f4aa34a2bd0461))
* **index:** ❤️ better looking friends list ([186df1a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/186df1a5e0e68c1aba388489811495c90de0bb05))
* **index:** 🔒 fix friends gif ([cabc70a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cabc70ae0f6a9eed64a42b106a9cc106f69c1a38))
* **index:** 🔨 fix stoph birthdate ([2563ae3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2563ae33cc30b4bb07deba62ec798ee7c22e2cce))
* **index:** 🔨 QoL ([e64a86c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e64a86c25f275f1f556ca7e98011d119a4751cfa))
* **index:** 🔨 QoL on index ([490c2de](https://gitlab.com/24-heures-insa/overbookd-mono/commit/490c2de0baf6956f7af2d97c785d074d6b1cc211))
* **index:** 🤯 QoL changes to index ([a0c21db](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a0c21db399f5c3e431783d82d82781b9fc4a26e8))
* **infra:** :fire: remove root ([a7bc588](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a7bc588a1a2b5d3c7751420fc3eb7761a4ac77f8))
* **infra:** :zap: specify platform for backend container ([9834741](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9834741fdf360a424c899e6dfe4bb875adb3a214))
* **inventory:** 🔥 hot fix ts compatibility ([c8d3500](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c8d3500d2d4e7f87f86b74e4d93937c528fffee5))
* **keycloak:** :lock: send email with correct object ([920ddc3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/920ddc3279160789eeb86184e19d3a06017d2bb2))
* **log:** :hammer: build & TS ([3c69373](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3c69373754734a183381707e5c2a3c652d4cfd19))
* **log:** :hammer: build & TS ([ab3a7f5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab3a7f54b65c051d39d938e593aa21d33ad41033))
* **log:** 🚚 fixed log ([da0e5db](https://gitlab.com/24-heures-insa/overbookd-mono/commit/da0e5dbd951ca46162a0d409d73515e9aea42012))
* **login:** 👋 remove drawer onh login and signup ([2bca1d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/2bca1d27f4376cc4755e596270e6e6fb7bdf8abc))
* **login:** 🔨 fix login ([864360b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/864360b559eb288e78ef91383f5f4269e66dace2))
* **login:** 🔨 passwords are hidden ([de45365](https://gitlab.com/24-heures-insa/overbookd-mono/commit/de45365ee86d6ff146ca6d9816cbe8757d137efe))
* **mail:** :bug: domain name ([ab98c8a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ab98c8acd1b3de38d297d78b62f83cb5bfc432c7))
* **money:** 💰 can't send money to user himself ([ecaaca4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ecaaca4554d2d37417282de26786eda4ee4d08fa))
* **navbar:** 🔨 fix navbar logo in mode switching ([86f8355](https://gitlab.com/24-heures-insa/overbookd-mono/commit/86f8355794f9225065de9325110d987929a3d25f))
* **notifications:** 🔨 fix bug causing notification to be deleted ([6a07555](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6a075551771d1b4abfa7d66bff24c4ce2b6477c9))
* **nuxt:** 🌳 BASE_URL for backend ([60ec6ec](https://gitlab.com/24-heures-insa/overbookd-mono/commit/60ec6ec77e23e0926fc3d6cfcf46954cecba8bd9))
* **patch:** ✨ fix 0.17.6 shortcomings ([ad5fbd6](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ad5fbd6f8746d95bdf22cbb6ef48d2b08e5162ab))
* **planning:** :bug: decalage de 2h ([c2a80c1](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c2a80c10f2cae2469159effe87099b67228c36db))
* **pp:** 🔨 fix .env ([f3c303c](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f3c303c33827913ac52f904a193609cda8a791f7))
* **pp:** 🔨 fix deleted pp ([45d6025](https://gitlab.com/24-heures-insa/overbookd-mono/commit/45d6025f6d872a2d62263ca139c8bd967ff7dd47))
* **Production:** :bug: change keycloak url ([cf3a496](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cf3a496431e3c5dacf7270f5ac177c38a4437402))
* **Production:** :bug: fix urls ([904a78f](https://gitlab.com/24-heures-insa/overbookd-mono/commit/904a78f58a204f7186d5e117dd7cb04b9e01f0cd))
* **Production:** :lock: Fix keyclaok ([1577916](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1577916d06282959c287c6eb7d50e2994bb9db64))
* property used but not defined ([3602f66](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3602f66fd4253e5ab86f6f7f84be979e51d4e108))
* **right:** :ambulance: soft have acceess to what they shloud have ([e74ac98](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e74ac980729c9dcdfdecd74d43c99ed4fb6f011b))
* **role:** 🔨 close forbidden roles ([9a60146](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9a60146138a99773992f2920fa57f88fdfc0c3c9))
* **roles:** 👽 humans can't give admin roles ([89abb49](https://gitlab.com/24-heures-insa/overbookd-mono/commit/89abb493e59a6390efd8f9549d95ce772c288191))
* small changes ([c5d68bd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c5d68bd158e8c8aca6106ad24f822253531ddaf8))
* **soft:** :ambulance: fix friend and notification build ([0fa810d](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0fa810da6d519351f42697923ee17e0a19d182c7))
* **soft:** :ambulance: hide friends card ([9b3931e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/9b3931e143789b61a9848dbd8798d0ca2ade991e))
* **soft:** :sparkles: now date, depart, year are display ([ca0faee](https://gitlab.com/24-heures-insa/overbookd-mono/commit/ca0faee10cebe8a543133570821395dc3b226834))
* **soft:** :zap: depart & year in form ([4068e95](https://gitlab.com/24-heures-insa/overbookd-mono/commit/4068e95434b5500d8c0b5de94e13340bd18f8723))
* **stats:** 📈 added stats and bug report ([33b95e5](https://gitlab.com/24-heures-insa/overbookd-mono/commit/33b95e5cd6b25353e2960e32e925d541422f88af))
* **strings:** 🔨 fixed spelling errors ([a253a1b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a253a1badd13fb9a161fab7630ace587cfca907d))
* **strings:** 🔨 fixed spelling errors ([f8ba1dd](https://gitlab.com/24-heures-insa/overbookd-mono/commit/f8ba1dd456575ca8dfec200805df459932ecb39d))
* **time:** ⏰ set allowed minutes ([10a7d24](https://gitlab.com/24-heures-insa/overbookd-mono/commit/10a7d24ef7dfac9c0819658b97f8cfb42ab85eaf))
* **transaction:** :tv: display sender and receiver. [#626](https://gitlab.com/24-heures-insa/overbookd-mono/issues/626) ([70ea726](https://gitlab.com/24-heures-insa/overbookd-mono/commit/70ea726034e7e9deb1333c9f86c6ec78ce7d9917))
* **transaction:** :zap: update dto to macth DB ([470e231](https://gitlab.com/24-heures-insa/overbookd-mono/commit/470e23174d1861a3010435dd619dfc62c05c106a))
* **transactions:** :moneybag: reverse display order. [#625](https://gitlab.com/24-heures-insa/overbookd-mono/issues/625) ([7f0185b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/7f0185b014cc2aff1226b9f65a508960f4ae14a7))
* **triage:** :wrench: pipeline ([78b98c9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/78b98c91da4ddab9448d82dd95e379b9c8c29166))
* **trombi:** 🎆 fixed image sizes [#60](https://gitlab.com/24-heures-insa/overbookd-mono/issues/60) ([cf8ec96](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cf8ec96e4da51d66f6509bdf70a501d978425833))
* typos in code ([286cca4](https://gitlab.com/24-heures-insa/overbookd-mono/commit/286cca40982628a9b750463b6756fc64e9710b41))
* **UI:** 🎨 added color on index ([c4875d9](https://gitlab.com/24-heures-insa/overbookd-mono/commit/c4875d98467e7dc8c9ef270a9c8948c5f4c494a8))
* **UI:** 🎨 better display reward charisma ([cb49ca3](https://gitlab.com/24-heures-insa/overbookd-mono/commit/cb49ca3198cb7195e240b9fa06f1c3120c212276))
* **UI:** 👀 cleaner icons ([5f5734b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5f5734bbcc05bbb6bb8321881eb20dd86cabda61))
* **UI:** 👀 cleaner icons ([6f7d882](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6f7d882d5cf180066cb4136e944af6d51292a4f9))
* **UI:** 👀 more visual FT name ([d11b84e](https://gitlab.com/24-heures-insa/overbookd-mono/commit/d11b84ee6adf8b9a952a78fa7e1458f24f922c96))
* **UI:** 🔨 display roles ([65a4356](https://gitlab.com/24-heures-insa/overbookd-mono/commit/65a43565c6e593a0133b82302b16313646ace28e))
* **User:** :ambulance: nickname not required anymore ([3f779ac](https://gitlab.com/24-heures-insa/overbookd-mono/commit/3f779ac3f50a4c1b43bdeef9dd8f064a76446e03))
* **user:** :bug: now driver license date is show ([0f7b4d2](https://gitlab.com/24-heures-insa/overbookd-mono/commit/0f7b4d2ab7607bf521fc0354bb22381ec0e35bc6))
* **User:** :bug: repare filter cotisation ([a6baa94](https://gitlab.com/24-heures-insa/overbookd-mono/commit/a6baa947b288f40cf408e8210a95e49bf720e687)), closes [#620](https://gitlab.com/24-heures-insa/overbookd-mono/issues/620)
* **User:** :fire: remove driverLicense from user ([6bfa26b](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6bfa26b13866f0cb30c1e3d49d250251fb659fdf))
* **user:** :hammer: now scene & bar avec acces to none validated users ([6536caf](https://gitlab.com/24-heures-insa/overbookd-mono/commit/6536caf3686c82e689a49a23a24a2db8970dd348))
* **User:** :sparkles: change teams to team ([5cbcb3a](https://gitlab.com/24-heures-insa/overbookd-mono/commit/5cbcb3a2358c1c1938c58ee5ebdb69d00ca334de))
* **User:** :sparkles: change users route to get team ([1cfa814](https://gitlab.com/24-heures-insa/overbookd-mono/commit/1cfa814623aff8cd1072ae650fcbd4b19f443719))
* **user:** 🐛 reste page to 1 when search ([fa53a23](https://gitlab.com/24-heures-insa/overbookd-mono/commit/fa53a235e8f3cb39a07015c6ea694663afaab8da))
* **user:** 🔨 bring back paid contributions ([099f370](https://gitlab.com/24-heures-insa/overbookd-mono/commit/099f370efddccf4d0a787a5327a212aa59ee35d4))
* **userInformation:** :ambulance: remove access to non-humans/admin ([e7e1045](https://gitlab.com/24-heures-insa/overbookd-mono/commit/e7e10455c4b4392218f2fe33ed6b3c388b0903e2))
* **workflow:** ♻ update project name ([feb4b13](https://gitlab.com/24-heures-insa/overbookd-mono/commit/feb4b133ec606e0a07bf2234f65749c9ae9b7375))
* **workflow:** ♻ update project name ([713d455](https://gitlab.com/24-heures-insa/overbookd-mono/commit/713d455b984f5f87e2776a3595d12e9091964a55))
