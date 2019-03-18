<template>
        <StackLayout>
			<Button class="bottom" text="Nouvelle série" @tap="takePicture" />
            <Button class="bottom" text="Vers une série existance" @tap="toggleShowSerie" />
            <WrapLayout v-show="show_serie">
				<Span v-for="serie in series"/>
			</WrapLayout>
            <Button class="bottom" text="Vers votre espace utilisateur" @tap="takePicture" />
        </StackLayout>
</template>

<script>


export default {
	data() {
		return {
			series: [],
            show_serie: false
		}
	},
	methods:{

		toggleShowSerie(){
			this.show_serie = !this.show_serie;
		},
		takePicture() {
				

		}
	}
}
</script>