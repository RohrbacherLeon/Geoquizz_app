<template>
	<Page>
		<ActionBar>
				<Image src="~/assets/images/logo.png"  width="115" class="logo"/>
		</ActionBar>
		<ScrollView orientation="vertical">
			<FlexboxLayout class="page">
				<Label v-if="error_message" :text="error_message" textWrap="true" class="error_message"/>
				<Label v-if="success_message" :text="success_message" textWrap="true" class="success_message"/>

				<StackLayout v-show="button_enable && !adding_picture" class="full-width">
					<Button class="btn" :text="transfering ? 'Retour au photos ' : 'Transférer mes photos'" @tap="toggleTransfer" />
				</StackLayout>

				<StackLayout v-show="adding_picture" class="component">
					<Label text="Veuillez entrer la description de votre photo" />
					<TextField class="input" hint="Description"  autocorrect="false" autocapitalizationType="none" v-model="new_photo_description" fontSize="18" />
					<Button text="Ajouter" @tap="add_description" class="btn btn-primary" />
				</StackLayout>

				<Camera v-show="!transfering && !adding_picture" class='component'></Camera>
				<WrapLayout v-show="!transfering  && !adding_picture">
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
	import axios from 'axios';

  	export default {
	data() {
		return {
			url: "http://76f1ae48.ngrok.io/",
			transfering: false,
			adding_picture: false,
			button_enable: true,
			images : [],
			series: [],
			cities: [],
			new_photo_description: '',
			success_message: '',
			error_message:''
		}
	},
	components:{Camera, Transfer},

	
	mounted() {
		this.getSeries();
	},
	
	methods:{

		reset_images(){
			this.images = [];
		},
		toggleTransfer(){
			if(this.images.length > 0) {
				this.transfering = !this.transfering;
				this.success_message = '';
				this.error_message = '';
				this.getSeries();
			} else {
				this.success_message = '';
				this.error_message = "Veuillez d'abord prendre une ou plusieurs photos.";
			}
		},

		add_description(index) {
			if (!this.new_photo_description) {
                this.alert(
                    "Merci d'entrer une description pour votre photo."
                );
                return;
            } else {
				this.images[(this.images.length-1)].description = this.new_photo_description;
				this.new_photo_description = '';
				this.adding_picture = !this.adding_picture;
			}
		},

		ui_set_description(){
			this.adding_picture = !this.adding_picture;
		},

		//Affiche un message d'alerte
		// Params : 
		// message : message à afficher
        alert(message) {
            return alert({
                title: "GeoQuizz",
                okButtonText: "OK",
                message: message
            });
        },

		//Recupère les noms des séries existantes
		getSeries(){
			this.series = [];
			this.cities = [];
			axios.get(this.url + "series").then((response) => {
				response.data._embedded.series.forEach(serie => {
					if(serie.id != 0) {
						this.series.push(serie);
						this.cities.push(serie.ville);
					}
				});
			}).catch((error) => {
				console.log(error);
			});
		},

		getSerieIndex(index){
			return this.series[index].id;
		}

	}
  }
</script>

<style scoped>
	ActionBar {
		background-color: #ffffff;
		color: #222;
		margin-bottom: 15;
	}

	.page {
		align-items: center;
		flex-direction: column;
		
	}

	.success_message {
		background-color: green;
		margin: 10 10;
		padding: 10 10;
		font-size: 18;
		text-align: center;
		border-radius: 20px;
	}

	.error_message {
		background-color: red;
		margin: 10 10;
		padding: 10 10;
		font-size: 18;
		text-align: center;
		border-radius: 20px;
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

	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
		background-color: #e2574c;
		color: white;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.component {
		width: 75%;
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

</style>
