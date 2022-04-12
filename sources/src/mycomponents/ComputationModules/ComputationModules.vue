<template>
	<div>
		<div class="row">
			<div class="col-xl-4 col-md-6 mb-4 app" v-for="module in modules" v-bind:key="module.id" :id="module.id">
				<div class="media shadow h-100 py-2" style="background: white;">
					<img :src="module.icon" class="mr-3" alt="">
					<div class="media-body">

						<div class="row ">

							<div class="col-md-9">

								<div>
									<h5 class="mt-0">
										<router-link :to="{ name: 'ComputationModule', params: {moduleId: module.id }}">
											{{ module.name }}
										</router-link>
									</h5>
								</div>

								<div>
									<span :id="module.authorId" class="small">
										By
									</span>
									<span class="small">
										<router-link :to="{ name: 'Person', params: {personId: module.authorId } }">
											{{ module.authorName }}
										</router-link>
									</span>
									<span class="small"> &bull; </span>
									<span class="small">
										Updated {{module._lastUpdateDate}}
									</span>
								</div>

								<div>
									{{ module.shortDescription }}
								</div>

								<div>
									<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in module.keywords" v-bind:key="keyword">{{ keyword }}</span>
								</div>

							</div>

							<div class="col-md-3 ">

								<div class="row ">
									<div class="col-md-6">
										<div class="row mx-auto font-weight-bold">{{ module.timesUsed }}</div>
										<div class="row mx-auto">Used</div>
									</div>

									<div class="col-md-6">
										<div class="row mx-auto font-weight-bold">{{ module.rate }}</div>
										<div class="row">Rate</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>


<!-- 			<div class="col-xl-4 col-md-6 mb-4 app" v-for="module in modules" v-bind:key="module.id" :id="module.id">
				<div class="media shadow h-100 py-2" style="background: white;">
					<div class="media-body">
						<router-link :to="{ name: 'ComputationModule', params: {moduleId: module.id }}">
							{{ module.name }}
						</router-link>
					</div>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script src="./ComputationModules.js"></script>