#include <iostream>
#include <string>
#include <sstream>
#include <exception>
#include <vector>
#include <algorithm>
#include <numeric>

using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int n;
        vector <int> v1;
        vector <pair<int,int>> moves;
        cin>>n;
        for (int i = 0; i < n; i++)
        {
            int num;
            cin>>num;
            while(i>1 && num<v1[i-2]){
                int max =*max_element(v1.begin(),v1.end());
                if(num<max){
                num +=max;
                moves.push_back(make_pair(i,v1.begin() - max_element(v1.begin(),v1.end())));
                }
                else{
                    num+=num;
                    moves.push_back(make_pair(i,i));
                }
            }
            v1.push_back(num);
        }
        cout<<moves.size()<<endl;
        for (int i = 0; i < moves.size(); i++)
        {
            cout<<moves[i].first<<" "<<moves[i].second<<endl;
        }
        
    }
    return EXIT_SUCCESS;
}