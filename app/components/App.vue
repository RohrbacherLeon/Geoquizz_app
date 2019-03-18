<template>
	<Page>
		<ActionBar>
			<GridLayout width="100%" columns="*">
				<Image src="~/assets/images/logo.png"  class="logo" col="1"/>
			</GridLayout>
		</ActionBar>
		<ScrollView orientation="vertical">
			<FlexboxLayout class="page">
				<StackLayout class="full-width">
					<Button class="btn" :text="transfering ? 'Retour au photos ' : 'Transférer mes photos'" @tap="toggleTransfer" />
				</StackLayout>
				<Camera v-show="!transfering" class='camera'></Camera>
				<Login v-show="mustLogin"></Login>
				<Transfer v-show="transfering" class="full-width"></Transfer>
			</FlexboxLayout>
		</ScrollView>
	</Page>
</template>

<script >
  	import Camera from "./Camera.vue"
	import Transfer from "./Transfer.vue"
  	import Login from "./Login.vue"

  	export default {
	data() {
		return {
			transfering: false,
			mustLogin: false
		}
	},
	components:{Camera, Transfer, Login},
	methods:{
		page(){
			this.$refs.drawer.nativeView.closeDrawer();
		},
		reset(){
			this.$refs.drawer.nativeView.closeDrawer();
		},
		toggleTransfer(){
			this.transfering = !this.transfering;
			console.log(this.$parent)
		}
	}
  }
</script>

<style scoped>
	ActionBar {
		background-color: #ffffff;
		color: #222;
	}

	.page {
		align-items: center;
		flex-direction: column;
		
	}

	.full-width {
		width: 100%;
	}

	.btn {
		margin-top: 5%;
		width: 75%;
		background-color: #e2574c;
		color: white;
	}

	.camera {
		width: 75%;
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
