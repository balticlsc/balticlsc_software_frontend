<template>
	<div>
		<div class="row">
			<div class="col-xl-4 col-md-6 mb-4 app" v-for="app in appsList" v-bind:key="app.uid" :id="app.uid" :relid="getLatestRelease(app)">
				<div class="media shadow h-100 py-2" style="background: white;">


					<!-- <img :src="app.icon" class="mr-3" alt="" style="margin-left: 7px;"> -->

					<img :src="app.icon" class="mr-3" alt="" style="margin-left: 7px;" width="50" height="50">

					<div class="media-body">

						<div class="row ">

							<div class="col-md-8">

								<div>
									<h5 class="mt-0">
										<router-link :to="{ name: 'AppDetails', params: {id: app.uid } }">
											{{ app.name }}
										</router-link>
									</h5>
								</div>

								<div>
								<!--
									<span :id="app.authorId" class="small">
										By
									</span>
									<span class="small">
										<router-link :to="{ name: 'Person', params: {personId: app.authorId } }">
											{{ app.authorFullName }}
										</router-link>
									</span>
									<span class="small"> &bull; </span>
									-->
									<span class="small">
										Updated on {{ app._lastUpdateDate | moment("MMMM Do YYYY, hh:mm") }}
									</span>
								</div>

								<div>
									<span class="small">
										{{ app.shortDescription }}
									</span>
								</div>

								<div>
									<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in app.keywords" v-bind:key="keyword">{{ keyword }}</span>
								</div>

							</div>

							<div class="col-md-4 ">
								<div class="btn-group-vertical mr-2">
									<div class="row ">
									<!-- <div class="row"> 
										<div class="col-md-6">
											<div class="row mx-auto">Used</div>
											<div class="row mx-auto font-weight-bold">{{ app.timesUsed }}</div>
										</div>

										<div class="col-md-6">
											<div class="row mx-auto">Rate</div>
											<div class="row mx-auto font-weight-bold">{{ app.rate }}</div>
										</div>
									</div>-->

									<!-- <div class="row"> -->
										<!-- <div class="col-md-12 mt-auto"> -->
											<!-- <div class=" float-right" > -->
												<h4 v-if="app.isInstalled"><span class="badge badge-info">In Cockpit</span></h4>
												<button v-if="!app.isInstalled" type="button" class="btn btn-sm btn-success" v-on:click="installApp" :disabled="isUnitDeprecated(app)">Add to Cockpit</button>
											<!-- </div> -->
										<!-- </div> -->
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./AppStore.js"></script>