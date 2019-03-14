<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Image src="~/assets/images/side_drawer.png" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
                <Image src="~/assets/images/logo.png"  class="logo" col="1"/>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer">
            <StackLayout ~drawerContent backgroundColor="#ffffff">
                <Label class="drawer-header" text="GeoQuizz"/>
                <Label class="drawer-item" @tap="page" text="Photos"/>
            </StackLayout>

            <GridLayout ~mainContent columns="*" rows="*">
                <StackLayout class="form">
                    <StackLayout class="input-field">
                        <TextField class="input" hint="Pseudo" autocorrect="false"></TextField>
                    </StackLayout>

                    <StackLayout class="input-field">
                        <TextField class="input" hint="Mot de passe" autocorrect="false"></TextField>
                    </StackLayout>

                    <Button text="Log In" class="btn btn-primary"></Button>
                </StackLayout>
            </GridLayout>
        </RadSideDrawer>
    </Page>
</template>

<script >
  import Camera from "./Camera.vue"
  export default {
    data() {
      return {
      }
    },
    components:{Camera},
    methods:{
      page(){
        this.$refs.drawer.nativeView.closeDrawer()
      },
      reset(){
        this.$refs.drawer.nativeView.closeDrawer()
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #ffffff;
        color: #222;
    }

    .logo {
        width :75%;
    }

    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #e2574c;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        color: #333333;
        font-size: 16;
    }
</style>
