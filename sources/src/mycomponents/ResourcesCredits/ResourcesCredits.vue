<template>
	<div>
		<h5>Cluster {{ clusterId }}</h5>

		<div class="row " style="margin-bottom: 10px;">
			<div class="col-sm">
				<section>
					<date-picker class="float-right" v-model="value" type="date" range placeholder="Select datetime range" :clearable="false" :editable="false" @change="handleChange"></date-picker>
				</section>
			</div>
		</div>

		<div class="card shadow mb-4" v-for="chart in charts" :key="chart.key">
<!-- 			<div class="card-header py-3">
				<h6 class="m-0 font-weight-bold text-primary">
					{{ chart.title }}
				</h6>
			</div> -->

			<div class="card-body">
				<div class="row">
					<column-chart :data="chart.data"></column-chart>
				</div>
			</div>
		</div>
	</div>

 </template>

<script src="./ResourcesCredits.js"></script>