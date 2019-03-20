<template>
	<Page>
		<ActionBar>
				<Image src="~/assets/images/Logo_small.png"  width="70" class="logo"/>
		</ActionBar>
		<ScrollView orientation="vertical">
			<FlexboxLayout class="page">
				<Label :text="error_message" />
				<Label :text="success_message" />
				<StackLayout class="full-width">
					<Button class="btn" :text="transfering ? 'Retour au photos ' : 'Transférer mes photos'" @tap="toggleTransfer" />
				</StackLayout>
				<Camera v-show="!transfering" class='component'></Camera>
				<WrapLayout v-show="!transfering">
					<Image v-for="(img, index) in images" v-bind:key="index" :src="img.src" width="150" height="150" marginBottom="5"/>
				</WrapLayout>
				<Transfer v-show="transfering" class="component"></Transfer>
			</FlexboxLayout>
		</ScrollView>
	</Page>
</template>

<script>
  	import Camera from "./Camera.vue"
	import Transfer from "./Transfer.vue"
	import { Image } from "tns-core-modules/ui/image";

  	export default {
	data() {
		return {
			transfering: false,
			images : [],
			success_message: '',
			error_message:''
		}
	},
	components:{Camera, Transfer},
	methods:{
		page(){
			this.$refs.drawer.nativeView.closeDrawer();
		},
		reset_images(){
			this.images = [];
		},
		toggleTransfer(){
			if(this.images.length > 0) {
				this.transfering = !this.transfering;
				this.success_message = '';
				this.error_message = '';
			} else {
				this.error_message = "Veuillez d'abord prendre une ou plusieurs photos.";
			}
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

	.component {
		width: 75%;
	}

	.logo {
		margin-top: 10px;

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
